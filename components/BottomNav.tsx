
import React from 'react';
import { HomeIcon, AttendanceIcon, FinanceIcon, NoticeIcon, MembersIcon } from '../constants';
import type { Screen } from '../types';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => {
  const activeClass = 'text-primary-dark';
  const inactiveClass = 'text-gray-500 hover:text-primary';

  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? activeClass : inactiveClass}`}>
      <Icon className="w-6 h-6" />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  const navItems: { screen: Screen; label: string; icon: React.ElementType }[] = [
    { screen: 'home', label: '홈', icon: HomeIcon },
    { screen: 'attendance', label: '출결', icon: AttendanceIcon },
    { screen: 'finance', label: '재정', icon: FinanceIcon },
    { screen: 'notice', label: '공지', icon: NoticeIcon },
    { screen: 'members', label: '멤버', icon: MembersIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-gray-200 shadow-t-lg md:max-w-md md:mx-auto">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <NavItem
            key={item.screen}
            icon={item.icon}
            label={item.label}
            isActive={activeScreen === item.screen}
            onClick={() => setActiveScreen(item.screen)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
