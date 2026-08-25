'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { parseFinancialFile, ValidationError } from '@/lib/utils/validation';
import { runFinancialRiskAgent } from '@/lib/agent/financialAgent';
import { Upload, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function HistoricalAnalysis() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file: File) => {
    setErrors([]);
    setSuccessMsg(null);

    // File Size Safeguard (Part 6) - Limit to 2 MB
    if (file.size > 2 * 1024 * 1024) {
      setErrors([
        {
          row: 0,
          column: 'File Size',
          message: 'File is too large to process. Please upload a smaller dataset.',
        },
      ]);
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      
      // Parse file using xlsx wrapper
      const result = await parseFinancialFile(buffer);

      if (!result.success) {
        setErrors(result.errors);
        setIsProcessing(false);
        return;
      }

      if (result.data.length < 3) {
        setErrors([
          {
            row: 0,
            column: 'Dataset',
            message: `The dataset has only ${result.data.length} periods. Historical regression modeling requires at least 3 months of historical data.`,
          },
        ]);
        setIsProcessing(false);
        return;
      }

      // Success! Run the orchestrator agent using the entire historical set
      // Use the last month's data as the "current" active month for metrics and scoring
      try {
        const sortedData = result.data; // assume chronological rows as provided
        const activeMonthData = sortedData[sortedData.length - 1];

        setSuccessMsg(`File parsed successfully. Running financial risk agent over ${sortedData.length} months...`);

        const report = await runFinancialRiskAgent(
          activeMonthData.income,
          activeMonthData.expenses,
          sortedData
        );

        // Store active report
        localStorage.setItem('statfin_report', JSON.stringify(report));
        
        // Redirect to report page
        router.push('/report');
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'An error occurred during agent analysis.';
        setErrors([
          {
            row: 0,
            column: 'Agent Engine',
            message: errMsg,
          },
        ]);
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setErrors([{ row: 0, column: 'File Reader', message: 'Failed to read file from disk.' }]);
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <div className="max-w-3xl flex flex-col gap-2">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
          Your financial history.
        </h1>
        <p className="text-muted text-sm leading-relaxed max-w-xl">
          Upload a structured CSV or Excel spreadsheet containing multiple months of income and expenditure to compute time-series trends, regression projections, and spending outliers.
        </p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Upload Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`rounded-xl border border-dashed p-12 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all-custom ${
              dragActive
                ? 'border-white bg-hover-surface'
                : 'border-border-subtle bg-dark-surface hover:border-neutral-500'
            }`}
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full border border-border-subtle bg-black flex items-center justify-center text-muted">
              <Upload size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-white font-medium">Drag & drop your file here, or click to browse</p>
              <p className="text-xs text-muted mt-1">Supports CSV, XLSX, or XLS spreadsheets</p>
            </div>
          </div>

          {/* Status Message */}
          {isProcessing && !successMsg && (
            <div className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
              <p className="text-xs text-white">Validating cells and computing dispersion statistics...</p>
            </div>
          )}

          {successMsg && (
            <div className="rounded-xl border border-border-subtle bg-neutral-900 p-6 flex items-center gap-3 text-white">
              <CheckCircle2 size={18} className="text-white shrink-0" />
              <p className="text-xs">{successMsg}</p>
            </div>
          )}

          {/* Errors list */}
          {errors.length > 0 && (
            <div className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                <AlertTriangle size={18} className="text-white" />
                <h3 className="text-sm font-medium text-white">Validation Violations Found</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px] text-muted">
                  <thead>
                    <tr className="border-b border-border-subtle pb-2 text-white">
                      <th className="pb-2 font-medium">Row</th>
                      <th className="pb-2 font-medium">Field/Column</th>
                      <th className="pb-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {errors.map((err, idx) => (
                      <tr key={idx} className="hover:bg-hover-surface/50">
                        <td className="py-2 text-white">{err.row > 0 ? err.row : 'Global'}</td>
                        <td className="py-2 text-neutral-400 font-semibold">{err.column}</td>
                        <td className="py-2 text-secondary-text">{err.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Resources / Sample Column */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-4">
            <h3 className="text-base uppercase tracking-wider text-white">Template Resources</h3>
            <p className="text-xs text-muted leading-relaxed">
              We provide a pre-formatted mock dataset representing 8 months of financial records under Indian Rupee styling (₹). Download this template to review the column layouts:
            </p>
            
            <a
              href="/sample-financial-data.csv"
              download="sample-financial-data.csv"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border-subtle bg-black text-white px-5 py-3 text-xs uppercase tracking-wider hover:bg-hover-surface transition-colors"
            >
              <Download size={14} /> Download Sample CSV
            </a>
          </div>

          <div className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-3 font-sans text-xs">
            <h4 className="text-white uppercase tracking-wider text-[11px]">CSV Schema Guidelines</h4>
            <ul className="text-muted space-y-2 leading-relaxed">
              <li>
                &bull; <strong className="text-white">Month:</strong> Must be unique chronologically (e.g. January, February).
              </li>
              <li>
                &bull; <strong className="text-white">Income:</strong> Must be a numeric value greater than zero.
              </li>
              <li>
                &bull; <strong className="text-white">Expenses:</strong> Numeric categories. Standard columns include Food, Transport, Housing, Utilities, Shopping, Entertainment, Healthcare, Education, and Other. Custom headers are auto-detected as extra expense slots.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="w-full max-w-5xl mx-auto mt-8 border-t border-border-subtle pt-6 text-[10px] text-muted text-center leading-relaxed font-light select-none">
        StatFin AI is an educational statistical analysis prototype. The Prototype Risk Score is a project-specific analytical indicator and has not been financially validated. This application does not provide professional financial, investment, lending, insurance, or tax advice.
      </div>
    </div>
  );
}
