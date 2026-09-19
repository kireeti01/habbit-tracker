import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Flame,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Check,
  Zap,
  Star,
  Sparkles,
  Key,
  Briefcase,
  Calendar,
  Activity,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const result = await login({ email, password });
    setLoading(false);

    if (result.success) {
      toast.success(`Welcome back, ${result.user.name || 'Achiever'}!`);
      navigate(from, { replace: true });
    } else {
      setErrorMessage(result.message || 'Invalid email or password');
      toast.error(result.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* 3D Habit Analytics Background Artwork */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40 mix-blend-screen">
        <img
          src="/habit_auth_bg.jpg"
          alt="Habit Tracker Data & Analytics Ecosystem"
          className="w-full h-full object-cover object-center transform scale-105 filter saturate-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-transparent to-[#070b14]" />
      </div>

      {/* Ambient background glow orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[140px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      {/* Floating 3D Streak Metric Chip (Top Right) */}
      <div className="absolute top-8 right-6 sm:right-16 z-10 hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#0e1628]/90 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)] backdrop-blur-md animate-float-slow">
        <span className="text-base">🔥</span>
        <div className="text-left">
          <div className="text-[10px] uppercase font-bold text-orange-400">Streak Engine</div>
          <div className="text-xs font-black text-white">45 Days Active</div>
        </div>
      </div>

      {/* Floating 3D Metric Chip: Left Consistency */}
      <div className="absolute top-1/3 left-6 sm:left-14 z-10 animate-float-reverse hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#091529]/90 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md">
        <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
        <div className="text-left">
          <div className="text-[10px] uppercase font-bold text-cyan-400">Consistency</div>
          <div className="text-xs font-black text-white">94% Adherence</div>
        </div>
      </div>

      {/* Floating 3D Metric Chip: Left AI Coach */}
      <div className="absolute top-1/2 left-8 sm:left-20 z-10 animate-float-slow hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#140f2b]/90 border border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.3)] backdrop-blur-md">
        <Zap className="w-4 h-4 text-purple-400 fill-purple-400" />
        <div className="text-left">
          <div className="text-[10px] uppercase font-bold text-purple-400">AI Coach</div>
          <div className="text-xs font-black text-white">Synchronized</div>
        </div>
      </div>

      {/* Floating 3D Metric Chip: Right Milestone */}
      <div className="absolute top-1/2 right-8 sm:right-20 z-10 animate-float-slow hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#091830]/90 border border-sky-400/60 shadow-[0_0_20px_rgba(56,189,248,0.3)] backdrop-blur-md">
        <Star className="w-4 h-4 text-sky-300 fill-sky-300" />
        <div className="text-left">
          <div className="text-[10px] uppercase font-bold text-sky-400">Milestone Tier</div>
          <div className="text-xs font-black text-white">Diamond League</div>
        </div>
      </div>


      {/* Top Brand Bar */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 pt-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-cyan-500/20 border border-orange-500/30 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(249,115,22,0.25)]">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
          </div>
          <div className="flex items-baseline">
            <span className="font-extrabold text-xl tracking-tight text-white">Streak</span>
            <span className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              Forge
            </span>
          </div>
        </Link>
      </header>

      {/* Central Login Card Container */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[420px]">
          {/* Header Title above Form */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-white uppercase text-3d-glow">
              LOGIN PAGE
            </h1>
          </div>

          {/* Neon Glow Container Card */}
          <div className="relative rounded-[32px] bg-[#0c1322]/85 border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(6,182,212,0.45),inset_0_0_15px_rgba(6,182,212,0.15)] p-6 sm:p-8 backdrop-blur-2xl transition-all">
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 bg-[#0a0f1d] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-2xl text-sm text-white placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-11 py-3 bg-[#0a0f1d] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-2xl text-sm text-white placeholder-slate-400 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button: Login to My Pulse */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-cyan-400/60 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember Me</span>
                </label>
                <button
                  type="button"
                  onClick={() => toast('Password reset link will be sent to your email.')}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Register Link */}
              <div className="pt-3 text-center text-xs text-slate-400">
                <span>Don't have an account? </span>
                <Link
                  to="/register"
                  className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  Register Now
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* 3D Character & Decorative Badges at Bottom */}
        <div className="mt-8 hidden sm:flex items-center justify-center gap-6 text-slate-400 text-xs">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#091529]/80 border border-slate-800 shadow-lg backdrop-blur-md">
            <Key className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-medium">Encrypted &amp; Secure</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#140f2b]/80 border border-slate-800 shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300 font-medium">Automatic Streak Sync</span>
          </div>
        </div>
      </main>

      {/* Clean Bottom Footer */}
      <footer className="relative z-20 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} StreakForge. All rights reserved. Built for growth.
      </footer>
    </div>
  );
}
