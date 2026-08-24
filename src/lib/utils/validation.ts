import * as XLSX from 'xlsx';
import { MonthlyData } from '../statistics/metrics';

export interface ValidationError {
  row: number;
  column: string;
  message: string;
}

export interface ParseResult {
  success: boolean;
  data: MonthlyData[];
  errors: ValidationError[];
}

const REQUIRED_COLUMNS = ['Month', 'Income'];
const STANDARD_EXPENSES = [
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other',
];

/**
 * Validates a single row of raw parsed data.
 */
export function validateRow(
  row: any,
  rowIndex: number
): { data?: MonthlyData; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  
  // 1. Validate Month
  const monthRaw = row['Month'];
  if (monthRaw === undefined || monthRaw === null || String(monthRaw).trim() === '') {
    errors.push({
      row: rowIndex + 2, // 1-based, and row 1 is header
      column: 'Month',
      message: 'Month is a required field and cannot be empty.',
    });
  }
  const month = String(monthRaw || '').trim();

  // 2. Validate Income
  const incomeRaw = row['Income'];
  let income = Number(incomeRaw);
  if (incomeRaw === undefined || incomeRaw === null) {
    errors.push({
      row: rowIndex + 2,
      column: 'Income',
      message: 'Income is a required field.',
    });
  } else if (isNaN(income)) {
    errors.push({
      row: rowIndex + 2,
      column: 'Income',
      message: `Income value "${incomeRaw}" is not a valid number.`,
    });
  } else if (income <= 0) {
    errors.push({
      row: rowIndex + 2,
      column: 'Income',
      message: 'Income must be a positive number greater than zero.',
    });
  }

  // 3. Validate Expenses
  const expenses: Record<string, number> = {};
  
  // We check standard categories as well as any other columns that are not Month/Income
  // which might be custom categories.
  for (const key of Object.keys(row)) {
    if (key === 'Month' || key === 'Income') continue;

    const valRaw = row[key];
    const amount = Number(valRaw);

    if (valRaw === undefined || valRaw === null || String(valRaw).trim() === '') {
      // Treat empty expenses as 0 rather than failing, but log a warning if needed.
      expenses[key] = 0;
    } else if (isNaN(amount)) {
      errors.push({
        row: rowIndex + 2,
        column: key,
        message: `Expense value "${valRaw}" in category "${key}" is not a valid number.`,
      });
    } else if (amount < 0) {
      errors.push({
        row: rowIndex + 2,
        column: key,
        message: `Expense in category "${key}" cannot be negative (value: ${amount}).`,
      });
    } else {
      expenses[key] = amount;
    }
  }

  // Ensure standard expense keys exist at minimum
  for (const cat of STANDARD_EXPENSES) {
    if (expenses[cat] === undefined) {
      expenses[cat] = 0;
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      month,
      income,
      expenses,
    },
    errors: [],
  };
}

/**
 * Parses an Excel or CSV file buffer into validated MonthlyData.
 */
export function parseFinancialFile(fileBuffer: ArrayBuffer): ParseResult {
  const errors: ValidationError[] = [];
  const validData: MonthlyData[] = [];

  try {
    const data = new Uint8Array(fileBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    
    if (workbook.SheetNames.length === 0) {
      return {
        success: false,
        data: [],
        errors: [{ row: 0, column: 'File', message: 'The uploaded file contains no sheets.' }],
      };
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Parse to JSON with header rows mapped to object keys
    const rawRows = XLSX.utils.sheet_to_json(worksheet);

    if (rawRows.length === 0) {
      return {
        success: false,
        data: [],
        errors: [{ row: 0, column: 'File', message: 'The uploaded sheet is empty.' }],
      };
    }

    // Check headers on the first row
    const firstRowKeys = Object.keys(rawRows[0] as object);
    const missingHeaders = REQUIRED_COLUMNS.filter((col) => !firstRowKeys.includes(col));

    if (missingHeaders.length > 0) {
      return {
        success: false,
        data: [],
        errors: [
          {
            row: 1,
            column: 'Header',
            message: `Missing required columns: ${missingHeaders.join(', ')}.`,
          },
        ],
      };
    }

    rawRows.forEach((row: any, idx: number) => {
      const { data: rowData, errors: rowErrors } = validateRow(row, idx);
      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
      } else if (rowData) {
        validData.push(rowData);
      }
    });

  } catch (err: any) {
    return {
      success: false,
      data: [],
      errors: [
        {
          row: 0,
          column: 'File',
          message: `Failed to parse file structure. Reason: ${err.message || err}`,
        },
      ],
    };
  }

  // Regression requires chronologically ordered months.
  // We don't sort here since the user defines the order, but we ensure there are no duplicate months.
  const monthsSeen = new Set<string>();
  validData.forEach((row, idx) => {
    if (monthsSeen.has(row.month)) {
      errors.push({
        row: idx + 2,
        column: 'Month',
        message: `Duplicate month entries found for "${row.month}". Each period must be unique.`,
      });
    }
    monthsSeen.add(row.month);
  });

  return {
    success: errors.length === 0,
    data: errors.length === 0 ? validData : [],
    errors,
  };
}
