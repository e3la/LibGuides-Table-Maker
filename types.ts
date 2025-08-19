
export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface CustomizationOptions {
  tableCaption: string;
  stripHtml: boolean;
  tableTheme: 'light' | 'dark' | 'high-contrast';
  stripedRows: boolean;
}
