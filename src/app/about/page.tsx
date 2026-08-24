import React from 'react';

export default function About() {
  return (
    <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12 select-none">
      
      {/* Header Section */}
      <section className="max-w-4xl flex flex-col gap-4 border-b border-border-subtle pb-8">
        <span className="text-xs uppercase tracking-[0.15em] text-muted">
          Project Information & Scope
        </span>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white font-serif">
          About StatFin AI.
        </h1>
        <p className="text-xl sm:text-2xl font-light italic text-secondary-text font-serif mt-2">
          Understand your money. Statistically.
        </p>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left 2 Columns: Description & Features */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <p className="text-sm sm:text-base text-secondary-text leading-relaxed font-light">
            StatFin AI is a personal financial risk assessment tool designed to help you better understand
            your spending, savings, and financial patterns. By combining statistical analysis with
            intelligent interpretation, StatFin AI transforms your financial data into clear insights about
            spending behaviour, trends, unusual expenses, and overall financial risk.
          </p>

          <div>
            <h2 className="text-lg text-white font-medium uppercase tracking-wider mb-4 text-[13px]">
              What StatFin AI does
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Analyzes income and expenses',
                'Measures savings and spending ratios',
                'Identifies unusual spending patterns',
                'Analyzes financial trends',
                'Generates a transparent risk score',
                'Provides simple, data-driven insights and recommendations',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="rounded-xl border border-border-subtle bg-dark-surface p-4 flex items-start gap-3 text-xs text-secondary-text leading-relaxed hover:border-neutral-500 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 shrink-0 mt-1.5"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-muted leading-relaxed font-light mt-2">
            StatFin AI keeps the focus on your data, turning numbers into information that is easier to
            understand and act on.
          </p>
        </div>

        {/* Right 1 Column: Privacy & Disclaimers */}
        <div className="flex flex-col gap-6">
          {/* Privacy Box */}
          <div className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-wider text-white font-bold">Privacy</h3>
            <p className="text-xs text-secondary-text leading-relaxed font-light">
              Your financial information is processed locally in your browser by default. StatFin AI does not
              require an account or permanent storage of your financial records.
            </p>
          </div>

          {/* Disclaimer Box */}
          <div className="rounded-xl border border-border-subtle bg-black p-6 flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-wider text-white font-bold">Important Notice</h3>
            <p className="text-[11px] text-muted leading-relaxed font-light">
              StatFin AI is an educational statistical analysis prototype. The Prototype Risk Score is a project-specific analytical indicator and has not been financially validated. This application does not provide professional financial, investment, lending, insurance, or tax advice.
            </p>
          </div>
        </div>
      </section>

      {/* Signature block */}
      <section className="border-t border-border-subtle pt-8 mt-4 text-center sm:text-left select-none">
        <p className="font-serif text-sm font-semibold text-white">StatFin AI</p>
        <p className="text-xs text-muted italic mt-0.5 font-serif">
          Statistical Intelligence for Smarter Financial Decisions.
        </p>
      </section>

    </div>
  );
}
