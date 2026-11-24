import React from 'react';
import { TrendingUp, CheckCircle2, Award, Sparkles, Coffee } from 'lucide-react';
import { Task, Project } from '../services/taskService';
import confetti from 'canvas-confetti';

interface ProgressProps {
  tasks: Task[];
  projects: Project[];
}

export function Progress({ tasks, projects }: ProgressProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleCelebrate = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const categoryBreakdown = ['Studies', 'Development', 'Personal', 'Other'].map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat);
    const catDone = catTasks.filter((t) => t.status === 'Completed').length;
    const catPct = catTasks.length > 0 ? Math.round((catDone / catTasks.length) * 100) : 0;
    return { category: cat, total: catTasks.length, done: catDone, pct: catPct };
  });

  return (
    <div className="space-y-8 animate-fadeIn text-[#3B281F] dark:text-[#F3E7D5]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#3B281F] dark:text-white flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#B88C65]" />
            <span>Progress & Café Analytics</span>
          </h2>
          <p className="text-xs text-[#65452F] dark:text-[#D6B99A] mt-0.5">Track your personal productivity, category completion, and cozy streaks.</p>
        </div>
        <button
          onClick={handleCelebrate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#B88C65] to-[#79543C] hover:from-[#79543C] hover:to-[#3B281F] text-[#FFF9F0] rounded-2xl text-xs font-bold shadow-lg shadow-[#B88C65]/30 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Celebrate Milestone</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#65452F] dark:text-[#D6B99A] uppercase">Completion Rate</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-400 border border-emerald-300">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#3B281F] dark:text-white font-mono tabular-nums">{completionRate}%</h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold mt-1">+12% increase this month</p>
          </div>
          <div className="w-full bg-[#D6B99A]/30 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#65452F] dark:text-[#D6B99A] uppercase">Tasks Completed</span>
            <div className="w-10 h-10 rounded-2xl bg-[#D6B99A]/40 dark:bg-[#65452F]/60 flex items-center justify-center text-[#3B281F] dark:text-[#D6B99A] border border-[#B88C65]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#3B281F] dark:text-white font-mono tabular-nums">{completedTasks} / {totalTasks}</h3>
            <p className="text-xs text-[#65452F] dark:text-[#D6B99A] font-semibold mt-1">Across all categories</p>
          </div>
          <div className="w-full bg-[#D6B99A]/30 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-[#65452F] h-full" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#65452F] dark:text-[#D6B99A] uppercase">Productivity Streak</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-400 border border-amber-300">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#3B281F] dark:text-white font-mono tabular-nums">7 Days</h3>
            <p className="text-xs text-amber-800 dark:text-amber-400 font-semibold mt-1">Consistent daily brewing</p>
          </div>
          <div className="w-full bg-[#D6B99A]/30 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-600 h-full w-[90%]" />
          </div>
        </div>
      </div>

      <div className="bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-[#3B281F] dark:text-white">Task Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryBreakdown.map((item) => (
            <div key={item.category} className="space-y-2 p-4 rounded-2xl border border-[#D6B99A]/50 dark:border-[#65452F]/50 bg-[#F3E7D5]/40 dark:bg-[#3B281F]/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#B88C65]" />
                  <h4 className="text-sm font-bold text-[#3B281F] dark:text-white">{item.category}</h4>
                </div>
                <span className="text-sm font-mono font-bold text-[#65452F] dark:text-[#D6B99A]">{item.pct}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#65452F]/80 dark:text-[#D6B99A]">
                <span>{item.done} of {item.total} completed</span>
              </div>
              <div className="w-full bg-[#D6B99A]/30 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#65452F] h-full" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
