import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, FolderKanban, ArrowUpRight, Plus, Sparkles, CheckSquare, Calendar as CalendarIcon, Coffee } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { Task, Project } from '../services/taskService';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  tasks: Task[];
  projects: Project[];
  onOpenNewTaskModal: () => void;
  onSelectTask: (task: Task) => void;
  onRefreshTasks: () => void;
}

export function Dashboard({ tasks, projects, onOpenNewTaskModal, onSelectTask, onRefreshTasks }: DashboardProps) {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Live clock updating every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Supabase Realtime Subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('tasks-realtime-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          onRefreshTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, onRefreshTasks]);

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'Friend';

  // Statistics
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const urgentCount = tasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const todayStr = currentTime.toISOString().split('T')[0];
  const todaysTasks = tasks.filter((t) => t.due_date === todayStr && t.status !== 'Completed');
  const recentTasks = [...tasks].sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()).slice(0, 5);

  // Calendar helpers
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const taskDates = new Set(tasks.filter(t => t.due_date).map(t => t.due_date));

  return (
    <div className="space-y-8 animate-fadeIn text-[#3B281F] dark:text-[#F3E7D5]">
      {/* Café Greeting Banner */}
      <div className="bg-gradient-to-r from-[#65452F] to-[#3B281F] border border-[#B88C65]/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-[#FFF9F0]">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#B88C65]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#B88C65] shrink-0 shadow-lg bg-[#FFF9F0]">
            <img src="/src/assets/images/cat_cafe_mascot_1795509148972.jpg" alt="Café Cat" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B88C65]/30 border border-[#B88C65]/50 rounded-full text-xs font-semibold text-[#FFF9F0]">
              <Coffee className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} · {currentTime.toLocaleTimeString()}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#FFF9F0]">
              {getGreeting()}, {displayName}! ☕
            </h2>
            <p className="text-[#D6B99A] text-xs max-w-xl">
              "Freshly brewed tasks & cozy moments. You have <span className="font-bold text-[#FFF9F0] underline">{todaysTasks.length} tasks</span> scheduled for today."
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={onOpenNewTaskModal}
            className="px-5 py-3 bg-[#B88C65] hover:bg-[#79543C] text-[#FFF9F0] font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Brew Task</span>
          </button>
          <Link
            to="/tasks"
            className="px-5 py-3 bg-[#3B281F]/80 hover:bg-[#3B281F] text-[#FFF9F0] font-bold text-xs rounded-2xl border border-[#B88C65]/40 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>Task Journal</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Daily Completion"
          value={`${completionRate}%`}
          change={`${completedCount} of ${totalTasks} done`}
          isPositive={true}
          icon={CheckCircle2}
          iconColor="bg-emerald-700 shadow-lg shadow-emerald-700/30"
        />
        <StatsCard
          title="In Progress"
          value={inProgressCount}
          change="Currently brewing"
          isPositive={true}
          icon={Clock}
          iconColor="bg-[#65452F] shadow-lg shadow-[#65452F]/30"
        />
        <StatsCard
          title="Pending Tasks"
          value={pendingCount}
          change="Waiting on deck"
          isPositive={true}
          icon={FolderKanban}
          iconColor="bg-[#B88C65] shadow-lg shadow-[#B88C65]/30"
        />
        <StatsCard
          title="Urgent Attention"
          value={urgentCount}
          change={urgentCount > 0 ? 'High priority' : 'All cozy'}
          isPositive={urgentCount === 0}
          icon={AlertCircle}
          iconColor="bg-rose-700 shadow-lg shadow-rose-700/30"
        />
      </div>

      {/* Main Content Split: Recent Tasks & Compact Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-[#3B281F] dark:text-[#FFF9F0]">Today's Café Agenda</h3>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-[#65452F] dark:text-[#D6B99A] hover:underline"
            >
              View All Tasks →
            </Link>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="p-4 rounded-2xl border border-[#D6B99A]/50 dark:border-[#65452F]/50 hover:border-[#B88C65] bg-[#F3E7D5]/40 dark:bg-[#3B281F]/40 cursor-pointer transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-[#D6B99A]/40 text-[#65452F] dark:bg-[#65452F]'}`}>
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-semibold text-[#3B281F] dark:text-white truncate">{task.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#65452F]/70 dark:text-[#D6B99A] mt-0.5">
                        <span className="font-medium text-[#65452F] dark:text-[#B88C65]">{project?.name || task.category}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{task.due_date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                      task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300' :
                      task.status === 'In Progress' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300' :
                      'bg-[#D6B99A]/30 text-[#65452F] dark:bg-slate-800 dark:text-slate-300 border border-[#D6B99A]'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compact Monthly Calendar */}
        <div className="bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#3B281F] dark:text-[#FFF9F0] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#B88C65]" />
                <span>{monthNames[month]} {year}</span>
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
                  className="px-2.5 py-1 rounded-xl bg-[#D6B99A]/30 dark:bg-[#65452F] text-xs font-bold hover:bg-[#B88C65] hover:text-white transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
                  className="px-2.5 py-1 rounded-xl bg-[#D6B99A]/30 dark:bg-[#65452F] text-xs font-bold hover:bg-[#B88C65] hover:text-white transition-colors"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-2">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isToday = dateStr === todayStr;
                const hasTask = taskDates.has(dateStr);

                return (
                  <div
                    key={dayNum}
                    className={`h-8 flex flex-col items-center justify-center rounded-xl font-mono text-xs relative ${
                      isToday
                        ? 'bg-[#B88C65] text-[#FFF9F0] font-bold shadow-md'
                        : hasTask
                        ? 'bg-[#D6B99A]/50 dark:bg-[#65452F]/60 text-[#3B281F] dark:text-[#FFF9F0] font-semibold'
                        : 'text-[#65452F] dark:text-slate-400 hover:bg-[#D6B99A]/20'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {hasTask && !isToday && (
                      <span className="w-1 h-1 bg-[#B88C65] rounded-full absolute bottom-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#D6B99A]/30 dark:border-[#65452F]/40 flex items-center justify-between text-[11px] text-[#65452F] dark:text-[#D6B99A]">
            <span>Highlighted = Scheduled Tasks</span>
            <span className="font-semibold">{tasks.length} total tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
