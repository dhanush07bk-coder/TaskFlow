import React from 'react';
import { Calendar, Bell } from 'lucide-react';
import { Task } from '../services/taskService';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : (task.status === 'Completed' ? 100 : 0);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-rose-700 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 border-rose-300';
      case 'High': return 'text-amber-800 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300';
      case 'Medium': return 'text-[#65452F] bg-[#D6B99A]/40 dark:bg-[#79543C]/40 dark:text-[#D6B99A] border-[#B88C65]/40';
      default: return 'text-slate-600 bg-slate-200 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Studies': return 'bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300';
      case 'Development': return 'bg-[#B88C65]/20 text-[#3B281F] dark:bg-indigo-950/60 dark:text-indigo-300 border-[#B88C65]/40';
      case 'Personal': return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
      default: return 'bg-[#D6B99A]/30 text-[#65452F] dark:bg-slate-800 dark:text-slate-300 border-[#D6B99A]/50';
    }
  };

  return (
    <div className="bg-[#FFF9F0] dark:bg-[#2E211A] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 group">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${getCategoryColor(task.category)}`}>
            {task.category}
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="text-xs text-[#65452F] dark:text-[#D6B99A] hover:text-[#3B281F] dark:hover:text-white px-2 py-1 rounded font-semibold"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs text-rose-700 dark:text-rose-400 hover:underline px-2 py-1 rounded font-semibold"
          >
            Delete
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-[#3B281F] dark:text-[#FFF9F0] line-clamp-1">{task.title}</h4>
        <p className="text-xs text-[#65452F]/80 dark:text-[#D6B99A]/80 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
      </div>

      {totalSubtasks > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-[#D6B99A]/30 dark:border-[#65452F]/40">
          <div className="flex items-center justify-between text-xs text-[#65452F] dark:text-[#D6B99A]">
            <span>Subtasks ({completedSubtasks}/{totalSubtasks})</span>
            <span className="font-mono tabular-nums">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#D6B99A]/30 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#B88C65] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {task.tags.map((tag, idx) => (
            <span key={idx} className="text-[10px] bg-[#D6B99A]/30 dark:bg-[#65452F]/40 text-[#3B281F] dark:text-[#F3E7D5] px-2.5 py-0.5 rounded-md font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-[#D6B99A]/30 dark:border-[#65452F]/40 text-xs text-[#65452F] dark:text-[#D6B99A]">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#B88C65]" />
          <span className="font-mono tabular-nums">{task.due_date}</span>
        </div>
        {task.reminder_enabled && task.reminder_at && (
          <div className="flex items-center gap-1 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
            <Bell className="w-3 h-3" />
            <span>Reminder set</span>
          </div>
        )}
      </div>
    </div>
  );
}
