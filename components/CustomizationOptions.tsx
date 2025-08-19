import React from 'react';
import type { CustomizationOptions as CustomizationOptionsType } from '../types';

interface CustomizationOptionsProps {
    options: CustomizationOptionsType;
    setOptions: (value: React.SetStateAction<CustomizationOptionsType>) => void;
}

const CustomizationOptions = ({ options, setOptions }: CustomizationOptionsProps) => {
    
    const handleOptionChange = (key: keyof CustomizationOptionsType, value: string | boolean) => {
        setOptions(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Table Caption */}
            <div className="space-y-2">
                <label htmlFor="table-caption" className="block text-sm font-medium text-slate-700">
                    Table Caption
                </label>
                <input
                    type="text"
                    id="table-caption"
                    value={options.tableCaption}
                    onChange={(e) => handleOptionChange('tableCaption', e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 rounded-md p-2 text-slate-900 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
                />
                <p className="text-xs text-slate-500">A descriptive caption is important for accessibility.</p>
            </div>

            {/* Table Theme */}
            <div className="space-y-2">
                <label htmlFor="table-theme" className="block text-sm font-medium text-slate-700">
                    Color Theme
                </label>
                <select
                    id="table-theme"
                    value={options.tableTheme}
                    onChange={(e) => handleOptionChange('tableTheme', e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 rounded-md p-2 text-slate-900 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
                >
                    <option value="light">Light (Default)</option>
                    <option value="dark">Dark</option>
                    <option value="high-contrast">High Contrast</option>
                </select>
                <p className="text-xs text-slate-500">Choose a visual theme for the table.</p>
            </div>
            
            {/* Other Options */}
            <div className="space-y-3 pt-2">
                 <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={options.stripedRows}
                        onChange={(e) => handleOptionChange('stripedRows', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-accent"
                    />
                    <span className="text-sm font-medium text-slate-700">Enable Striped Rows</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={options.stripHtml}
                        onChange={(e) => handleOptionChange('stripHtml', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-accent"
                    />
                    <span className="text-sm font-medium text-slate-700">Strip HTML from cells</span>
                </label>
                {!options.stripHtml && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
                        Warning: Disabling this allows raw HTML. Ensure your content is trusted to avoid XSS risks.
                    </p>
                )}
            </div>

        </div>
    );
};

export default CustomizationOptions;
