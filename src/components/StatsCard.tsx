import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor: string;
}

export function StatsCard({ title, value, change, isPositive, icon: Icon, iconColor }: StatsCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between text-slate-100">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold text-white font-mono tabular-nums">{value}</h3>
        {change && (
          <p className={`text-xs mt-1 font-medium ${isPositive ? 'text-emerald-400' : 'text-slate-400'}`}>
            {change}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconColor}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}
