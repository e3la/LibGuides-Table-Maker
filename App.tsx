import React from 'react';
import Header from './components/Header';
import DataInput from './components/DataInput';
import CustomizationOptions from './components/CustomizationOptions';
import TablePreview from './components/TablePreview';
import CodeOutput from './components/CodeOutput';
import { CogIcon, EyeIcon, CodeBracketIcon } from './components/icons';
import { generateTableHtml } from './utils/generator';
import type { TableData, CustomizationOptions as CustomizationOptionsType } from './types';

const App = () => {
  const [tableData, setTableData] = React.useState<TableData | null>(null);
  const [generatedHtml, setGeneratedHtml] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [customizationOptions, setCustomizationOptions] = React.useState<CustomizationOptionsType>({
    tableCaption: 'A descriptive title for your table.',
    stripHtml: true,
    tableTheme: 'light',
    stripedRows: true,
  });

  const handleDataParsed = React.useCallback((data: TableData) => {
    if (data.headers.length > 0 && data.rows.length > 0) {
      setTableData(data);
      setError(null);
    } else {
      setError('Parsed data is empty or invalid. Please check your input.');
      setTableData(null);
      setGeneratedHtml('');
    }
  }, []);

  React.useEffect(() => {
    if (tableData) {
      setGeneratedHtml(generateTableHtml(tableData, customizationOptions));
    }
  }, [tableData, customizationOptions]);

  const handleClear = React.useCallback(() => {
    setTableData(null);
    setGeneratedHtml('');
    setError(null);
  }, []);
  
  const processedDataForPreview = React.useMemo(() => {
    if (!tableData) return null;
    
    if (!customizationOptions.stripHtml) return tableData;

    const strip = (html: string) => {
      // This is a browser-only function.
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    };

    return {
      ...tableData,
      rows: tableData.rows.map(row => row.map(strip)),
    };
  }, [tableData, customizationOptions.stripHtml]);


  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <DataInput onDataParsed={handleDataParsed} onClear={handleClear} error={error} />

        {tableData && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
               <h2 className="text-2xl font-bold mb-4 text-slate-800 flex items-center">
                <CogIcon className="h-6 w-6 mr-2 text-brand-primary" />
                Customization Options
              </h2>
              <CustomizationOptions 
                options={customizationOptions}
                setOptions={setCustomizationOptions}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
                <h2 className="text-2xl font-bold mb-4 text-slate-800 flex items-center">
                  <EyeIcon className="h-6 w-6 mr-2 text-brand-primary" />
                  Interactive Preview
                </h2>
                <div className="text-slate-800">
                  {processedDataForPreview && <TablePreview data={processedDataForPreview} />}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
                <h2 className="text-2xl font-bold mb-4 text-slate-800 flex items-center">
                  <CodeBracketIcon className="h-6 w-6 mr-2 text-brand-primary" />
                  Generated Code
                </h2>
                <CodeOutput html={generatedHtml} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
