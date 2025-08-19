import React from 'react';
import { ClipboardIcon, UploadIcon, ClearIcon } from './icons';
import { parseTableData } from '../utils/parser';
import type { TableData } from '../types';

interface DataInputProps {
    onDataParsed: (data: TableData) => void;
    onClear: () => void;
    error: string | null;
}

const DataInput = ({ onDataParsed, onClear, error }: DataInputProps) => {
  const [mode, setMode] = React.useState('paste');
  const [pastedText, setPastedText] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onDataParsed(parseTableData(text));
      };
      reader.readAsText(file);
    }
  }, [onDataParsed]);

  const handleGenerateFromPaste = React.useCallback(() => {
    onDataParsed(parseTableData(pastedText));
  }, [pastedText, onDataParsed]);

  const handleClearInput = () => {
    setPastedText('');
    setFileName('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    onClear();
  }

  const TabButton = ({ currentMode, targetMode, children }: { currentMode: string, targetMode: string, children: React.ReactNode }) => {
    const isActive = currentMode === targetMode;
    return (
        <button
            onClick={() => setMode(targetMode)}
            className={`flex items-center justify-center px-4 py-2 -mb-px text-sm font-semibold rounded-t-lg border-b-2 transition-colors duration-200 ease-in-out
            ${isActive
                ? 'text-brand-primary border-brand-primary'
                : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300'
            }`}
        >
            {children}
        </button>
    );
  };


  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
        <div className="flex border-b border-slate-200 mb-4">
            <TabButton currentMode={mode} targetMode="paste"><ClipboardIcon className="w-5 h-5 mr-2" /> Paste Data</TabButton>
            <TabButton currentMode={mode} targetMode="upload"><UploadIcon className="w-5 h-5 mr-2" /> Upload CSV</TabButton>
        </div>

        {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-md mb-4" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
        )}

        {mode === 'paste' && (
            <div className="space-y-4">
                <label htmlFor="paste-area" className="block text-sm font-medium text-slate-700">
                    Paste your table data here (from a spreadsheet or CSV):
                </label>
                <textarea
                    id="paste-area"
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-100 border border-slate-300 rounded-md p-3 text-slate-900 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
                    placeholder="You can paste data directly from Google Sheets, Excel, or as comma-separated values.&#10;Header1,Header2,Header3&#10;Data1A,Data1B,Data1C"
                />
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleGenerateFromPaste}
                        disabled={!pastedText}
                        className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Generate Table
                    </button>
                     <button onClick={handleClearInput} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors flex items-center">
                        <ClearIcon className="w-5 h-5 mr-2" /> Clear
                    </button>
                </div>
            </div>
        )}

        {mode === 'upload' && (
            <div className="space-y-4">
                <p className="text-sm font-medium text-slate-700">Select a .csv file to process:</p>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="csv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadIcon className="w-10 h-10 mb-3 text-slate-400" />
                            <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-slate-500">CSV files only</p>
                        </div>
                        <input id="csv-upload" ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>
                 {fileName && <p className="text-sm text-green-600">File selected: <span className="font-medium">{fileName}</span></p>}
                  <button onClick={handleClearInput} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors flex items-center">
                    <ClearIcon className="w-5 h-5 mr-2" /> Clear
                </button>
            </div>
        )}
    </div>
  );
};

export default DataInput;
