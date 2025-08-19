import React from 'react';
import { TableIcon } from './icons';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
        <TableIcon className="h-8 w-8 text-brand-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 ml-3">
          LibGuides Accessible Table Maker
        </h1>
      </div>
    </header>
  );
};

export default Header;
