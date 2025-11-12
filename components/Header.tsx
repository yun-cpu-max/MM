
import React from 'react';
import { SettingsIcon } from '../constants';

interface HeaderProps {
  title: string;
  groupName: string;
}

const Header: React.FC<HeaderProps> = ({ title, groupName }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-surface border-b border-gray-200 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-onSurface">{title}</h1>
        <p className="text-sm text-onSurfaceSecondary">{groupName}</p>
      </div>
      <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-primary-dark">
        <SettingsIcon className="w-6 h-6" />
      </button>
    </header>
  );
};

export default Header;
