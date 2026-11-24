import React, { useState } from 'react';
import { Columns, List, Plus, Filter } from 'lucide-react';
import { Task, Project, TaskCategory, TaskStatus } from '../services/taskService';
import { TaskCard } from '../components/TaskCard';

interface MyTasksProps {
  tasks: Task[];
  projects: Project[];
  onOpenNewTaskModal: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  searchQuery: string;
}

export function MyTasks({ tasks, projects, onOpenNewTaskModal, onEditTask, onDeleteTask, onUpdateTaskStatus, searchQuery }: MyTasksProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');

  const categories: TaskCategory[] = ['Studies', 'Development', 'Personal', 'Other'];

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategoryFilter === 'all' || t.category === selectedCategoryFilter;
    const matchesPriority = selectedPriorityFilter === 'all' || t.priority === selectedPriorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'Pending', label: 'Pending', color: 'border-[#D6B99A]' },
    { id: 'In Progress', label: 'In Progress', color: 'border-[#B88C65]' },
    { id: 'Completed', label: 'Completed', color: 'border-emerald-600' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn text-[#3B281F] dark:text-[#F3E7D5]">
      {/* Controls Bar */}
      <div className="bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#65452F] dark:text-[#D6B99A] font-bold">
            <Filter className="w-3.5 h-3.5 text-[#B88C65]" />
            <span>Café Filter:</span>
          </div>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-[#F3E7D5]/70 dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3.5 py-2 text-xs text-[#3B281F] dark:text-[#FFF9F0] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="bg-[#F3E7D5]/70 dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3.5 py-2 text-xs text-[#3B281F] dark:text-[#FFF9F0] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center p-1 bg-[#F3E7D5]/70 dark:bg-[#3B281F] rounded-2xl border border-[#D6B99A] dark:border-[#65452F]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                viewMode === 'kanban' ? 'bg-[#65452F] text-[#FFF9F0] shadow-sm' : 'text-[#65452F] dark:text-[#D6B99A] hover:text-[#3B281F]'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                viewMode === 'list' ? 'bg-[#65452F] text-[#FFF9F0] shadow-sm' : 'text-[#65452F] dark:text-[#D6B99A] hover:text-[#3B281F]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#65452F] hover:bg-[#3B281F] text-[#FFF9F0] rounded-2xl text-xs font-bold shadow-lg shadow-[#65452F]/20 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-[#B88C65]" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="bg-[#FFF9F0]/60 dark:bg-[#241A15]/60 border border-[#D6B99A] dark:border-[#65452F] rounded-3xl p-4 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D6B99A]/40 dark:border-[#65452F]/40">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 ${col.color}`} />
                    <h3 className="text-xs font-extrabold text-[#3B281F] dark:text-[#FFF9F0] uppercase tracking-wider">{col.label}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#D6B99A]/30 dark:bg-[#3B281F] px-2.5 py-0.5 rounded-full text-[#65452F] dark:text-[#D6B99A]">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3.5 flex-1">
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-[#D6B99A] dark:border-[#65452F] rounded-2xl text-xs text-[#65452F]/60 dark:text-[#D6B99A]/60 font-medium">
                      No tasks in {col.label} 🐾
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F3E7D5] dark:bg-[#3B281F] border-b border-[#D6B99A] dark:border-[#65452F] text-[#65452F] dark:text-[#D6B99A] uppercase tracking-wider font-bold">
                  <th className="p-4">Task Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6B99A]/30 dark:divide-[#65452F]/40">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-[#F3E7D5]/40 dark:hover:bg-[#3B281F]/40 transition-colors">
                    <td className="p-4 font-bold text-[#3B281F] dark:text-white">{task.title}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-[#D6B99A]/30 dark:bg-[#65452F]/60 text-[#3B281F] dark:text-[#D6B99A] rounded-lg font-semibold">
                        {task.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={task.status}
                        onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                        className="bg-[#F3E7D5] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-xl px-2.5 py-1.5 text-xs text-[#3B281F] dark:text-slate-200 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-4 font-semibold text-[#65452F] dark:text-slate-300">{task.priority}</td>
                    <td className="p-4 font-mono tabular-nums text-[#65452F] dark:text-slate-400">{task.due_date}</td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => onEditTask(task)} className="text-[#B88C65] font-bold hover:underline">Edit</button>
                      <button onClick={() => onDeleteTask(task.id)} className="text-rose-700 dark:text-rose-400 font-bold hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
