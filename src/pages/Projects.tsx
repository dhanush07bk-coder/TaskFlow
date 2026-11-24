import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle2, X, Coffee } from 'lucide-react';
import { Project, Task, TaskCategory } from '../services/taskService';

interface ProjectsProps {
  projects: Project[];
  tasks: Task[];
  onSaveProject: (project: Project) => void;
}

export function Projects({ projects, tasks, onSaveProject }: ProjectsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Development');
  const [deadline, setDeadline] = useState('2026-06-30');
  const [color, setColor] = useState('bg-[#65452F]');

  const categories: TaskCategory[] = ['Studies', 'Development', 'Personal', 'Other'];

  const colorOptions = [
    { label: 'Espresso', value: 'bg-[#3B281F]' },
    { label: 'Coffee', value: 'bg-[#65452F]' },
    { label: 'Mocha', value: 'bg-[#79543C]' },
    { label: 'Caramel', value: 'bg-[#B88C65]' },
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newProj: Project = {
      id: 'proj-' + Date.now(),
      name,
      description,
      category,
      deadline,
      color,
      progress: 0,
    };
    onSaveProject(newProj);
    setName('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#3B281F] dark:text-[#F3E7D5]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#3B281F] dark:text-white flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#B88C65]" />
            <span>Café Project Portfolios</span>
          </h2>
          <p className="text-xs text-[#65452F] dark:text-[#D6B99A] mt-0.5">Organise your studies, coding projects, and cozy goals.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#65452F] hover:bg-[#3B281F] text-[#FFF9F0] rounded-2xl text-xs font-bold shadow-lg shadow-[#65452F]/20 transition-colors"
        >
          <Plus className="w-4 h-4 text-[#B88C65]" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const projTasks = tasks.filter((t) => t.projectId === proj.id);
          const completedTasks = projTasks.filter((t) => t.status === 'Completed').length;
          const totalTasks = projTasks.length;

          return (
            <div key={proj.id} className="bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-lg text-white ${proj.color}`}>
                    {proj.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#65452F] dark:text-[#D6B99A] font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#B88C65]" />
                    <span>{proj.deadline}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#3B281F] dark:text-white">{proj.name}</h3>
                  <p className="text-xs text-[#65452F]/80 dark:text-[#D6B99A]/80 mt-1.5 leading-relaxed">{proj.description}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#D6B99A]/30 dark:border-[#65452F]/40">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#65452F] dark:text-[#D6B99A]">
                    <span>Progress</span>
                    <span className="font-mono font-bold">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-[#D6B99A]/30 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${proj.color}`} style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#65452F] dark:text-[#D6B99A]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>{completedTasks}/{totalTasks} tasks done</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#3B281F]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl max-w-lg w-full p-6 shadow-2xl text-[#3B281F] dark:text-[#F3E7D5]">
            <div className="flex items-center justify-between pb-4 border-b border-[#D6B99A]/40 dark:border-[#65452F]/40">
              <h3 className="text-base font-bold text-[#3B281F] dark:text-white">Create New Project ☕</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#65452F] dark:text-[#D6B99A] hover:bg-[#D6B99A]/30 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1">Project Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cozy React App & DSA Mastery"
                  required
                  className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-4 py-3 text-sm text-[#3B281F] dark:text-white focus:outline-none focus:border-[#B88C65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Goals and milestones..."
                  rows={3}
                  className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-4 py-3 text-sm text-[#3B281F] dark:text-white focus:outline-none focus:border-[#B88C65]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3 py-3 text-sm text-[#3B281F] dark:text-white focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3 py-3 text-sm text-[#3B281F] dark:text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1">Accent Color</label>
                <div className="flex gap-3">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setColor(opt.value)}
                      className={`w-8 h-8 rounded-full ${opt.value} ${color === opt.value ? 'ring-4 ring-[#B88C65]/50' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D6B99A]/40 dark:border-[#65452F]/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#D6B99A]/30 dark:bg-slate-800 text-[#3B281F] dark:text-slate-300 rounded-2xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#65452F] hover:bg-[#3B281F] text-[#FFF9F0] rounded-2xl text-xs font-bold shadow-lg"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
