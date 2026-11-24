import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderKanban, BarChart3, LogOut, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Sidebar() {
  const { user, signOut } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/tasks', label: 'My Tasks', icon: CheckSquare },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/progress', label: 'Progress', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[#3B281F] border-r border-[#65452F]/40 flex flex-col h-screen sticky top-0 shrink-0 select-none text-[#F3E7D5]">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-[#65452F]/40 gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#B88C65] flex items-center justify-center text-[#3B281F] font-extrabold shadow-lg shadow-[#3B281F]/30 text-lg">
          🐾
        </div>
        <div>
          <h1 className="font-extrabold text-[#FFF9F0] tracking-tight leading-none text-base">TaskFlow</h1>
          <span className="text-[11px] text-[#D6B99A] font-medium">Cozy Cat Café Edition</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-[#D6B99A]/70 uppercase tracking-wider">
          Café Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#65452F] text-[#FFF9F0] shadow-md border border-[#B88C65]/30'
                    : 'text-[#D6B99A] hover:bg-[#65452F]/40 hover:text-[#FFF9F0]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B88C65]' : 'text-[#D6B99A]/70'}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* Café Mascot Box */}
        <div className="mt-8 mx-2 p-4 rounded-2xl bg-[#65452F]/30 border border-[#B88C65]/30 text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#B88C65]">
            <img src="/src/assets/images/cat_cafe_mascot_1795509148972.jpg" alt="Café Cat" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs font-semibold text-[#FFF9F0]">"A little café for your busy mind."</p>
          <span className="text-[10px] text-[#D6B99A] block">Brewing productivity & purrs ☕</span>
        </div>
      </div>

      {/* User Profile Footer */}
      {user && (
        <div className="p-4 border-t border-[#65452F]/40 bg-[#3B281F]/80 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-[#B88C65] shrink-0" />
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-[#FFF9F0] truncate">{user.name}</h4>
              <p className="text-xs text-[#D6B99A] truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            title="Log Out"
            className="p-2 text-[#D6B99A] hover:text-rose-300 rounded-xl hover:bg-[#65452F]/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
