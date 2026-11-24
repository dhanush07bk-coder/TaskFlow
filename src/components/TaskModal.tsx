import React, { useState, useEffect } from 'react';
import { X, Sparkles, Trash2, Bell } from 'lucide-react';
import { Task, Subtask, Project, TaskCategory, TaskStatus, TaskPriority, taskService } from '../services/taskService';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  initialTask?: Task | null;
  projects: Project[];
}

export function TaskModal({ isOpen, onClose, onSave, initialTask, projects }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [category, setCategory] = useState<TaskCategory>('Development');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderAt, setReminderAt] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [error, setError] = useState('');

  const categories: TaskCategory[] = ['Studies', 'Development', 'Personal', 'Other'];

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setStatus(initialTask.status || 'Pending');
      setPriority(initialTask.priority || 'Medium');
      setCategory(initialTask.category || 'Development');
      setProjectId(initialTask.projectId || projects[0]?.id || 'proj-1');
      setDueDate(initialTask.due_date || new Date().toISOString().split('T')[0]);
      setEstimatedHours(initialTask.estimated_hours || 4);
      setReminderEnabled(initialTask.reminder_enabled || false);
      setReminderAt(initialTask.reminder_at ? initialTask.reminder_at.slice(0, 16) : '');
      setSubtasks(initialTask.subtasks || []);
      setTags(initialTask.tags || []);
      setAiSummary('');
    } else {
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setPriority('Medium');
      setCategory('Development');
      setProjectId(projects[0]?.id || 'proj-1');
      setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setEstimatedHours(4);
      setReminderEnabled(false);
      setReminderAt('');
      setSubtasks([]);
      setTags(['Café']);
      setAiSummary('');
    }
    setError('');
  }, [isOpen, initialTask, projects]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: 'sub-' + Date.now(), title: newSubtaskTitle.trim(), completed: false, hours: 2 },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleAddTag = () => {
    if (!newTag.trim() || tags.includes(newTag.trim())) return;
    setTags([...tags, newTag.trim()]);
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAiBreakdown = async () => {
    if (!title.trim()) {
      setError('Please enter a task title before asking AI to break it down.');
      return;
    }
    setIsAiLoading(true);
    setError('');
    try {
      const data = await taskService.breakdownTaskWithAI(title, description);
      if (data.summary) setAiSummary(data.summary);
      if (data.estimatedTotalHours) setEstimatedHours(data.estimatedTotalHours);
      if (data.suggestedPriority) setPriority(data.suggestedPriority as TaskPriority);
      if (data.subtasks && Array.isArray(data.subtasks)) {
        const newSubs: Subtask[] = data.subtasks.map((st: any, idx: number) => ({
          id: 'ai-sub-' + Date.now() + '-' + idx,
          title: st.title,
          completed: false,
          hours: st.hours || 2,
        }));
        setSubtasks(newSubs);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI breakdown');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    onSave({
      title,
      description,
      status,
      priority,
      category,
      projectId,
      due_date: dueDate,
      estimated_hours: estimatedHours,
      reminder_enabled: reminderEnabled,
      reminder_at: reminderEnabled && reminderAt ? new Date(reminderAt).toISOString() : null,
      subtasks,
      tags,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#3B281F]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8 text-[#3B281F] dark:text-[#F3E7D5]">
        <div className="flex items-center justify-between pb-4 border-b border-[#D6B99A]/40 dark:border-[#65452F]/40">
          <h3 className="text-lg font-bold text-[#3B281F] dark:text-[#FFF9F0]">
            {initialTask ? 'Edit Task' : 'Brew New Task ☕'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-[#65452F] dark:text-[#D6B99A] hover:bg-[#D6B99A]/30 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-100 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-300 rounded-2xl text-xs">
            {error}
          </div>
        )}

        {aiSummary && (
          <div className="mt-4 p-3 bg-[#D6B99A]/30 dark:bg-[#65452F]/40 border border-[#B88C65] text-[#3B281F] dark:text-[#FFF9F0] rounded-2xl text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#B88C65]" />
            <div>
              <span className="font-bold block mb-0.5">Café AI Barista Suggestion</span>
              {aiSummary}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#65452F] dark:text-[#D6B99A]">Task Title *</label>
              <button
                type="button"
                onClick={handleAiBreakdown}
                disabled={isAiLoading}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#65452F] dark:text-[#D6B99A] bg-[#D6B99A]/40 dark:bg-[#65452F]/60 px-3 py-1 rounded-xl border border-[#B88C65]/40 transition-colors disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 text-[#B88C65] ${isAiLoading ? 'animate-spin' : ''}`} />
                <span>{isAiLoading ? 'Brewing...' : 'AI Breakdown'}</span>
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finish React component architecture"
              required
              className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-4 py-3 text-sm text-[#3B281F] dark:text-[#FFF9F0] focus:outline-none focus:border-[#B88C65]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, links, or notes..."
              rows={3}
              className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-4 py-3 text-sm text-[#3B281F] dark:text-[#FFF9F0] focus:outline-none focus:border-[#B88C65]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3 py-3 text-sm text-[#3B281F] dark:text-[#FFF9F0] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3 py-3 text-sm text-[#3B281F] dark:text-[#FFF9F0] focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3 py-3 text-sm text-[#3B281F] dark:text-[#FFF9F0] focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3 py-3 text-sm text-[#3B281F] dark:text-[#FFF9F0] focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3 py-3 text-sm text-[#3B281F] dark:text-[#FFF9F0] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Estimated Hours</label>
              <input
                type="number"
                min={1}
                max={100}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3 py-3 text-sm text-[#3B281F] dark:text-[#FFF9F0] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Reminder Section */}
          <div className="p-4 rounded-2xl bg-[#D6B99A]/20 dark:bg-[#3B281F]/50 border border-[#D6B99A]/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#B88C65]" />
                <span className="text-xs font-bold text-[#3B281F] dark:text-[#FFF9F0]">Smart Café Reminder</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#B88C65]"></div>
              </label>
            </div>
            {reminderEnabled && (
              <div>
                <label className="block text-[11px] font-semibold text-[#65452F] dark:text-[#D6B99A] mb-1">Reminder Date & Time</label>
                <input
                  type="datetime-local"
                  value={reminderAt}
                  onChange={(e) => setReminderAt(e.target.value)}
                  className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-xl px-3 py-2 text-xs text-[#3B281F] dark:text-[#FFF9F0] font-mono"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Subtasks Checklist</label>
            <div className="space-y-2 mb-2">
              {subtasks.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => {
                        setSubtasks(
                          subtasks.map((s) => (s.id === sub.id ? { ...s, completed: !s.completed } : s))
                        );
                      }}
                      className="rounded text-[#B88C65] focus:ring-[#B88C65] w-4 h-4"
                    />
                    <span className={`text-xs ${sub.completed ? 'line-through text-slate-400' : 'text-[#3B281F] dark:text-[#FFF9F0]'}`}>
                      {sub.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(sub.id)}
                    className="text-rose-700 dark:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add subtask..."
                className="flex-1 bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3 py-2 text-xs text-[#3B281F] dark:text-[#FFF9F0] focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-4 py-2 bg-[#D6B99A]/40 dark:bg-[#65452F] hover:bg-[#B88C65] text-[#3B281F] dark:text-[#FFF9F0] text-xs font-bold rounded-2xl transition-colors border border-[#B88C65]"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 bg-[#D6B99A]/30 dark:bg-[#65452F]/60 text-[#3B281F] dark:text-[#FFF9F0] text-xs px-2.5 py-1 rounded-xl border border-[#B88C65]">
                  <span>#{tag}</span>
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-rose-600">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="flex-1 bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3 py-2 text-xs text-[#3B281F] dark:text-[#FFF9F0] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-[#D6B99A]/40 dark:bg-[#65452F] hover:bg-[#B88C65] text-[#3B281F] dark:text-[#FFF9F0] text-xs font-bold rounded-2xl transition-colors border border-[#B88C65]"
              >
                Add Tag
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D6B99A]/40 dark:border-[#65452F]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#D6B99A]/30 dark:bg-slate-800 text-[#3B281F] dark:text-slate-300 rounded-2xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#65452F] hover:bg-[#3B281F] text-[#FFF9F0] rounded-2xl text-xs font-bold shadow-lg shadow-[#65452F]/20 transition-colors"
            >
              {initialTask ? 'Save Changes' : 'Brew Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
