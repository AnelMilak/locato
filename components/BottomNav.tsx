import React from 'react';
import { Home, Search, Heart, User } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Početna' },
    { id: 'search', icon: Search, label: 'Pretraga' },
    { id: 'favorites', icon: Heart, label: 'Omiljeni' },
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] dark:shadow-none rounded-t-[2rem] px-6 py-4 flex justify-between items-center z-40 transition-colors duration-300">
      {navItems.map((item) => {
        const isActive = currentScreen === item.id || (currentScreen === 'detail' && item.id === 'home');
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as Screen)}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-orange-500 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500 hover:text-orange-300 dark:hover:text-orange-300'
              }`}
          >
            <item.icon size={24} className={isActive ? 'fill-current' : ''} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        )
      })}
    </div>
  );
};

export default BottomNav;
