import React from 'react';
import { SettingsIcon, LogoutIcon } from '../constants';

interface HeaderProps {
  title: string;
  groupName: string;
  onLogout: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, groupName, onLogout, onSettingsClick }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-surface border-b border-gray-200 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-onSurface">{title}</h1>
        <p className="text-sm text-onSurfaceSecondary">{groupName}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={onSettingsClick} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-primary-dark" aria-label="설정">
          <SettingsIcon className="w-6 h-6" />
        </button>
         <button onClick={onLogout} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-red-500" aria-label="로그아웃">
          <LogoutIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;