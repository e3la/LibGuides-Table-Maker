import React from 'react';
import type { TableData } from '../types';

interface TablePreviewProps {
  data: TableData;
}

const TablePreview = ({ data }: TablePreviewProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortColumn, setSortColumn] = React.useState<number | null>(null);
  const [sortDirection, setSortDirection] = React.useState('none');

  const filteredRows = React.useMemo(() => {
    if (!searchTerm) return data.rows;
    const lowercasedFilter = searchTerm.toLowerCase();
    return data.rows.filter(row =>
      row.some(cell => cell.toLowerCase().includes(lowercasedFilter))
    );
  }, [data.rows, searchTerm]);

  const sortedRows = React.useMemo(() => {
    if (sortColumn === null || sortDirection === 'none') {
      return filteredRows;
    }

    const sorted = [...filteredRows].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      
      const isNumeric = !isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB));

      if (isNumeric) {
        return parseFloat(valA) - parseFloat(valB);
      } else {
        return valA.localeCompare(valB, undefined, { sensitivity: 'base' });
      }
    });

    if (sortDirection === 'desc') {
      sorted.reverse();
    }
    return sorted;
  }, [filteredRows, sortColumn, sortDirection]);

  const handleSort = React.useCallback((columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  }, [sortColumn]);
  
  const getSortIndicator = (columnIndex: number) => {
    if (sortColumn !== columnIndex || sortDirection === 'none') return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label htmlFor="preview-search" className="sr-only">Search table</label>
        <input
          id="preview-search"
          type="search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Filter rows..."
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              {data.headers.map((header, index) => (
                <th key={index} scope="col" className="p-2 border border-slate-300 text-left">
                    <button onClick={() => handleSort(index)} className="w-full flex justify-between items-center font-bold">
                        {header}
                        <span className="ml-2 text-slate-500">{getSortIndicator(index)}</span>
                    </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="even:bg-slate-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-2 border border-slate-300">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {sortedRows.length === 0 && (
            <p className="text-center p-4 text-slate-500">No matching rows found.</p>
        )}
      </div>
    </div>
  );
};

export default TablePreview;
