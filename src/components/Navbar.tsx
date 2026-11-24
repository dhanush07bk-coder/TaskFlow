import React from 'react';
import { Sun, Moon, Plus, Search, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  onOpenNewTaskModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function Navbar({ onOpenNewTaskModal, searchQuery, setSearchQuery }: NavbarProps) {
  const { darkMode, toggleDarkMode } = useAuth();
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard & Café Lounge';
      case '/tasks': return 'Task Journal';
      case '/projects': return 'Café Projects';
      case '/progress': return 'Progress & Brews';
      default: return 'TaskFlow Café';
    }
  };

  return (
    <header className="h-20 bg-[#FFF9F0] dark:bg-[#241A15] border-b border-[#D6B99A]/40 dark:border-[#65452F]/40 px-8 flex items-center justify-between gap-8 sticky top-0 z-10 shrink-0 text-[#3B281F] dark:text-[#F3E7D5] transition-colors">
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Coffee className="w-5 h-5 text-[#B88C65]" />
          <h2 className="text-base font-extrabold tracking-tight">
            {getTitle()}
          </h2>
        </div>
      </div>

      <div className="flex-1 max-w-md hidden md:flex items-center relative">
        <Search className="w-4 h-4 text-[#B88C65] absolute left-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks, studies, or projects..."
          className="w-full bg-[#F3E7D5]/70 dark:bg-[#3B281F]/75 border border-[#D6B99A] dark:border-[#65452F] focus:border-[#B88C65] rounded-2xl pl-10 pr-4 py-2 text-sm text-[#3B281F] dark:text-[#FFF9F0] placeholder-[#65452F]/60 dark:placeholder-[#D6B99A]/60 focus:outline-none transition-colors"
        />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-2xl text-[#65452F] dark:text-[#D6B99A] hover:bg-[#D6B99A]/30 dark:hover:bg-[#65452F]/40 transition-colors"
          title="Toggle Cozy Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenNewTaskModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#65452F] hover:bg-[#3B281F] text-[#FFF9F0] rounded-2xl text-xs font-bold shadow-lg shadow-[#65452F]/20 transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 text-[#B88C65]" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
