import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, User as UserIcon, Eye, EyeOff, AlertCircle, CheckCircle2, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { signIn, signUp } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    if (isSignup) {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignup) {
        const { error: signUpError } = await signUp(email.trim(), password, fullName.trim());
        if (signUpError) {
          throw signUpError;
        }
        setSuccessMessage('Registration successful! Please check your email for confirmation or sign in.');
        setIsSignup(false);
      } else {
        const { error: signInError } = await signIn(email.trim(), password);
        if (signInError) {
          throw signInError;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] dark:bg-[#1D1410] flex items-center justify-center p-4 relative overflow-hidden text-[#3B281F] dark:text-[#F3E7D5]">
      {/* Background Warm Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#B88C65]/15 rounded-full blur-3xl pointer-events-none -top-32 -left-32" />
      <div className="absolute w-[500px] h-[500px] bg-[#65452F]/15 rounded-full blur-3xl pointer-events-none -bottom-32 -right-32" />

      <div className="bg-[#FFF9F0] dark:bg-[#241A15] border border-[#D6B99A] dark:border-[#65452F] rounded-3xl max-w-md w-full p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#B88C65] flex items-center justify-center text-[#3B281F] font-bold text-2xl mx-auto shadow-lg shadow-[#3B281F]/20">
            🐾
          </div>
          <h1 className="text-2xl font-extrabold text-[#3B281F] dark:text-white tracking-tight">TaskFlow Café</h1>
          <p className="text-xs text-[#65452F] dark:text-[#D6B99A]">"A little café for your busy mind."</p>
        </div>

        {/* Toggle tabs */}
        <div className="flex bg-[#F3E7D5] dark:bg-[#3B281F] p-1 rounded-2xl border border-[#D6B99A] dark:border-[#65452F]">
          <button
            type="button"
            onClick={() => { setIsSignup(false); setError(null); setSuccessMessage(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-colors ${!isSignup ? 'bg-[#65452F] text-[#FFF9F0] shadow-sm' : 'text-[#65452F] dark:text-[#D6B99A] hover:text-[#3B281F]'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignup(true); setError(null); setSuccessMessage(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-colors ${isSignup ? 'bg-[#65452F] text-[#FFF9F0] shadow-sm' : 'text-[#65452F] dark:text-[#D6B99A] hover:text-[#3B281F]'}`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-100 dark:bg-rose-950/80 border border-rose-300 text-rose-800 dark:text-rose-300 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#B88C65] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dhanush"
                  required={isSignup}
                  className="w-full bg-[#F3E7D5]/50 dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#3B281F] dark:text-white focus:outline-none focus:border-[#B88C65]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#B88C65] absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dhanush@taskflow.io"
                required
                className="w-full bg-[#F3E7D5]/50 dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#3B281F] dark:text-white focus:outline-none focus:border-[#B88C65]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#B88C65] absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#F3E7D5]/50 dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl pl-10 pr-10 py-3 text-sm text-[#3B281F] dark:text-white focus:outline-none focus:border-[#B88C65]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#65452F] dark:text-[#D6B99A]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-[#65452F] dark:text-[#D6B99A] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#B88C65] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required={isSignup}
                  className="w-full bg-[#F3E7D5]/50 dark:bg-[#3B281F] border border-[#D6B99A] dark:border-[#65452F] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#3B281F] dark:text-white focus:outline-none focus:border-[#B88C65]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#65452F] hover:bg-[#3B281F] text-[#FFF9F0] font-bold text-sm rounded-2xl shadow-lg shadow-[#65452F]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Brewing...</span>
            ) : (
              <>
                <span>{isSignup ? 'Create Café Account' : 'Sign In to Café'}</span>
                <ArrowRight className="w-4 h-4 text-[#B88C65]" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#D6B99A]/40 dark:border-[#65452F]/40 text-center">
          <p className="text-[11px] text-[#65452F]/80 dark:text-[#D6B99A]">
            Secured with Supabase Auth & RLS policies.
          </p>
        </div>
      </div>
    </div>
  );
}
