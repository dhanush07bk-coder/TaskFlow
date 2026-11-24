/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { TaskModal } from './components/TaskModal';
import { Dashboard } from './pages/Dashboard';
import { MyTasks } from './pages/MyTasks';
import { Projects } from './pages/Projects';
import { Progress } from './pages/Progress';
import { Login } from './pages/Login';
import { taskService, Task, Project } from './services/taskService';
import { isSupabaseConfigured, testSupabaseConnection } from './lib/supabase';
import { Database, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

function SupabaseConnectionStatusBar() {
  const [showConfig, setShowConfig] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      testSupabaseConnection().then((res) => {
        setIsConnected(res.success);
        if (!res.success) {
          setTestResult(res);
        }
      });
    } else {
      setIsConnected(false);
    }
  }, []);

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setTesting(true);
    saveSupabasePublishableKey(keyInput.trim());
    const res = await testSupabaseConnection();
    setTestResult(res);
    setIsConnected(res.success);
    setTesting(false);
    if (res.success) {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  if (isConnected && !testResult) {
    return (
      <div className="bg-[#65452F] text-[#FFF9F0] border-b border-[#3B281F] px-6 py-2 flex items-center justify-between text-xs font-semibold z-30">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#B88C65] shrink-0" />
          <span>TaskFlow Café Connected: <code className="font-mono">https://bbgunezhutmbtqhyviiz.supabase.co</code> (RLS Active)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#3B281F] text-[#FFF9F0] border-b border-[#65452F] px-6 py-2.5 flex items-center justify-between text-xs z-30">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-[#B88C65] shrink-0" />
        <span>Supabase publishable key required. Project URL: <code className="font-mono">https://bbgunezhutmbtqhyviiz.supabase.co</code></span>
      </div>
      <button
        onClick={() => setShowConfig(!showConfig)}
        className="font-bold underline hover:text-[#B88C65] transition-colors"
      >
        {showConfig ? 'Close' : 'Enter Publishable Key'}
      </button>

      {showConfig && (
        <div className="fixed inset-0 bg-[#3B281F]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl max-w-md w-full p-6 shadow-2xl text-[#3B281F] dark:text-[#F3E7D5] space-y-4">
            <h3 className="text-base font-bold text-[#3B281F] dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-[#B88C65]" />
              <span>Enter Supabase Publishable Key</span>
            </h3>
            <p className="text-xs text-[#65452F] dark:text-[#D6B99A] leading-relaxed">
              Project URL is configured as <code className="text-[#3B281F] dark:text-indigo-300 font-mono">https://bbgunezhutmbtqhyviiz.supabase.co</code>. Please paste your Supabase Publishable Anon Key below.
            </p>

            {testResult && (
              <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${testResult.success ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'}`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1">Publishable Anon Key</label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  required
                  className="w-full bg-[#FFF9F0] dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl px-3 py-2 text-xs text-[#3B281F] dark:text-white focus:outline-none focus:border-[#B88C65] font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="px-4 py-2 bg-[#D6B99A]/40 dark:bg-slate-800 text-[#3B281F] dark:text-slate-300 rounded-2xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={testing}
                  className="px-5 py-2 bg-[#65452F] hover:bg-[#3B281F] text-[#FFF9F0] rounded-2xl text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {testing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save & Test Connection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthenticatedLayout() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => taskService.getProjects());
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask.id, taskData);
        setTasks(tasks.map((t) => (t.id === editingTask.id ? updated : t)));
      } else {
        const created = await taskService.createTask(taskData as any);
        setTasks([created, ...tasks]);
      }
      setEditingTask(null);
      await fetchTasks();
    } catch (err: any) {
      alert('Error saving task: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
      await fetchTasks();
    } catch (err: any) {
      alert('Error deleting task: ' + (err.message || 'Unknown error'));
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const updated = await taskService.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));
    } catch (err: any) {
      alert('Error updating status: ' + (err.message || 'Unknown error'));
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveProject = (newProj: Project) => {
    const updated = [newProj, ...projects];
    setProjects(updated);
    taskService.saveProjects(updated);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FFF9F0] dark:bg-[#1D1410] text-[#3B281F] dark:text-[#F3E7D5] flex-col">
      <SupabaseConnectionStatusBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar
            onOpenNewTaskModal={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3 text-[#65452F]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#B88C65]" />
                  <p className="text-xs font-semibold">Brewing tasks from Supabase...</p>
                </div>
              ) : error ? (
                <div className="p-6 bg-rose-100 border border-rose-300 text-rose-900 rounded-3xl text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
                  <div>
                    <p className="font-bold">Failed to load tasks</p>
                    <p className="text-xs opacity-90 mt-0.5">{error}</p>
                  </div>
                </div>
              ) : (
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Dashboard
                        tasks={tasks}
                        projects={projects}
                        onOpenNewTaskModal={() => {
                          setEditingTask(null);
                          setIsTaskModalOpen(true);
                        }}
                        onSelectTask={handleEditTask}
                        onRefreshTasks={fetchTasks}
                      />
                    }
                  />
                  <Route
                    path="/tasks"
                    element={
                      <MyTasks
                        tasks={tasks}
                        projects={projects}
                        onOpenNewTaskModal={() => {
                          setEditingTask(null);
                          setIsTaskModalOpen(true);
                        }}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        onUpdateTaskStatus={handleUpdateTaskStatus}
                        searchQuery={searchQuery}
                      />
                    }
                  />
                  <Route
                    path="/projects"
                    element={
                      <Projects
                        projects={projects}
                        tasks={tasks}
                        onSaveProject={handleSaveProject}
                      />
                    }
                  />
                  <Route
                    path="/progress"
                    element={
                      <Progress tasks={tasks} projects={projects} />
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              )}
            </div>
          </main>
        </div>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        projects={projects}
      />
    </div>
  );
}

function MainApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#FFF9F0] dark:bg-[#1D1410] flex flex-col items-center justify-center gap-3 text-[#65452F]">
        <Loader2 className="w-8 h-8 animate-spin text-[#B88C65]" />
        <p className="text-xs font-semibold">Brewing café session...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/*"
          element={user ? <AuthenticatedLayout /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
