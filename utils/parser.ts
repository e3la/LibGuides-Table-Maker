import type { TableData } from '../types';

/**
 * Parses delimited text (like CSV or TSV) into table data.
 * It automatically detects whether the data is comma or tab-separated based on the header row.
 * This is designed to handle data pasted from spreadsheets like Google Sheets (TSV) or standard CSV files.
 * @param text The raw data string.
 * @returns A TableData object with headers and rows.
 */
export const parseTableData = (text: string): TableData => {
  const trimmedText = text.trim();
  if (!trimmedText) {
    return { headers: [], rows: [] };
  }

  const lines = trimmedText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  // Detect separator by checking for tabs in the first line. Fallback to comma.
  const separator = lines[0].includes('\t') ? '\t' : ',';

  const splitLine = (line: string) => {
    if (separator === '\t') {
      return line.split('\t');
    }
    // For CSV, use a regex to handle commas within quoted fields.
    return line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  };

  const cleanCell = (cell: string) => {
    // Remove quotes if they exist at the start/end of a cell.
    return cell.trim().replace(/^"(.+(?="$))"$/, '$1');
  };

  const headers = splitLine(lines[0]).map(cleanCell);
  
  const rows = lines.slice(1).map(line => {
    const row = splitLine(line).map(cleanCell);
    // Only include rows that have the same number of columns as the header.
    // This helps filter out malformed lines.
    if (row.length === headers.length) {
      return row;
    }
    return null;
  // Filter out null (malformed) rows and rows that are completely empty.
  }).filter((row): row is string[] => row !== null && row.some(cell => cell.trim() !== ''));

  return { headers, rows };
};
