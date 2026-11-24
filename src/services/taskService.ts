import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type TaskCategory = 'Studies' | 'Development' | 'Personal' | 'Other';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  hours?: number;
}

export interface Task {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  reminder_at?: string | null;
  reminder_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  subtasks: Subtask[];
  tags: string[];
  estimated_hours: number;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  category: TaskCategory;
  progress: number;
  deadline: string;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Cozy Web Development',
    description: 'Cat café web app styling, React components & Supabase integration.',
    color: 'bg-[#65452F]',
    category: 'Development',
    progress: 85,
    deadline: '2026-04-15',
  },
  {
    id: 'proj-2',
    name: 'Algorithmic Studies & DSA',
    description: 'Data structures, trees, graphs, and system design practice.',
    color: 'bg-[#79543C]',
    category: 'Studies',
    progress: 70,
    deadline: '2026-05-01',
  },
  {
    id: 'proj-3',
    name: 'Café Routine & Wellness',
    description: 'Morning stretches, hydration, reading, and evening walks.',
    color: 'bg-[#B88C65]',
    category: 'Personal',
    progress: 60,
    deadline: '2026-06-01',
  },
  {
    id: 'proj-4',
    name: 'Hackathon & Open Source',
    description: 'Building delightful UI features and contributing to React community.',
    color: 'bg-[#3B281F]',
    category: 'Other',
    progress: 40,
    deadline: '2026-04-30',
  },
];

export const taskService = {
  getProjects(): Project[] {
    const saved = localStorage.getItem('taskflow_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  },

  saveProjects(projects: Project[]) {
    localStorage.setItem('taskflow_projects', JSON.stringify(projects));
  },

  async getTasks(): Promise<Task[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase client is not initialized. Please configure your Supabase publishable key.');
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error('User is not authenticated. Please log in.');
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks from Supabase:', error.message);
      throw new Error(error.message);
    }

    return (data || []).map((t: any) => ({
      id: t.id,
      user_id: t.user_id,
      title: t.title,
      description: t.description || '',
      category: t.category,
      priority: t.priority || 'Medium',
      status: t.status || 'Pending',
      due_date: t.due_date || new Date().toISOString().split('T')[0],
      reminder_at: t.reminder_at || null,
      reminder_enabled: t.reminder_enabled || false,
      created_at: t.created_at,
      updated_at: t.updated_at,
      subtasks: t.subtasks || [],
      tags: t.tags || [],
      estimated_hours: t.estimated_hours || 4,
      projectId: t.project_id || 'proj-1',
    }));
  },

  async createTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Task> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error('Never insert a task without a valid authenticated user.');
    }

    if (!taskData.title || !taskData.title.trim()) {
      throw new Error('Task title is required.');
    }
    if (!taskData.category) {
      throw new Error('Task category is required.');
    }

    const payload = {
      user_id: userData.user.id,
      title: taskData.title.trim(),
      description: taskData.description || '',
      category: taskData.category,
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      due_date: taskData.due_date || null,
      reminder_at: taskData.reminder_at || null,
      reminder_enabled: taskData.reminder_enabled || false,
      subtasks: taskData.subtasks || [],
      tags: taskData.tags || [],
      estimated_hours: taskData.estimated_hours || 4,
      project_id: taskData.projectId || 'proj-1',
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error creating task in Supabase:', error.message);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      description: data.description || '',
      category: data.category,
      priority: data.priority,
      status: data.status,
      due_date: data.due_date || '',
      reminder_at: data.reminder_at || null,
      reminder_enabled: data.reminder_enabled || false,
      created_at: data.created_at,
      updated_at: data.updated_at,
      subtasks: data.subtasks || [],
      tags: data.tags || [],
      estimated_hours: data.estimated_hours || 4,
      projectId: data.project_id || 'proj-1',
    };
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error('User is not authenticated.');
    }

    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title.trim();
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.priority !== undefined) payload.priority = updates.priority;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.due_date !== undefined) payload.due_date = updates.due_date || null;
    if (updates.reminder_at !== undefined) payload.reminder_at = updates.reminder_at || null;
    if (updates.reminder_enabled !== undefined) payload.reminder_enabled = updates.reminder_enabled;
    if (updates.subtasks !== undefined) payload.subtasks = updates.subtasks;
    if (updates.tags !== undefined) payload.tags = updates.tags;
    if (updates.estimated_hours !== undefined) payload.estimated_hours = updates.estimated_hours;
    if (updates.projectId !== undefined) payload.project_id = updates.projectId;
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('tasks')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task in Supabase:', error.message);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Task does not exist or you do not have permission to update it.');
    }

    return {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      description: data.description || '',
      category: data.category,
      priority: data.priority,
      status: data.status,
      due_date: data.due_date || '',
      reminder_at: data.reminder_at || null,
      reminder_enabled: data.reminder_enabled || false,
      created_at: data.created_at,
      updated_at: data.updated_at,
      subtasks: data.subtasks || [],
      tags: data.tags || [],
      estimated_hours: data.estimated_hours || 4,
      projectId: data.project_id || 'proj-1',
    };
  },

  async deleteTask(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error('User is not authenticated.');
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.user.id);

    if (error) {
      console.error('Error deleting task in Supabase:', error.message);
      throw new Error(error.message);
    }
  },

  async breakdownTaskWithAI(title: string, description: string) {
    const res = await fetch('/api/ai/breakdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate AI task breakdown');
    }
    return res.json();
  },
};
