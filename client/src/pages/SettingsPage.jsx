import React, { useState, useEffect } from 'react';
import {
  User,
  Globe,
  Sun,
  Moon,
  Lock,
  Download,
  ShieldCheck,
  LogOut,
  Sparkles,
  FileSpreadsheet,
  FileJson,
  Check,
  Zap,
  KeyRound,
  Database,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { userApi } from '../api/userApi';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, setUser, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Export State
  const [exportingJson, setExportingJson] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTimezone(user.timezone || 'UTC');
    }
  }, [user]);

  const handleAutoDetectTimezone = () => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected) {
      setTimezone(detected);
      toast.success(`Timezone calibrated: ${detected}`);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await userApi.updateProfile({ name, timezone, theme });
      setUser(res.data.user);
      toast.success('Profile settings successfully updated!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setSavingPassword(true);
    try {
      await userApi.updatePassword({ currentPassword, newPassword });
      toast.success('Security key changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password';
      toast.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleExport = async (format) => {
    if (format === 'json') setExportingJson(true);
    if (format === 'csv') setExportingCsv(true);

    try {
      await userApi.exportData(format);
      toast.success(`Exported ${format.toUpperCase()} archive successfully!`);
    } catch (err) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    } finally {
      if (format === 'json') setExportingJson(false);
      if (format === 'csv') setExportingCsv(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Account & System Configuration</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Control your profile identity, cryptographic credentials, and telemetry exports.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center font-black text-sm text-white shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="pr-2">
            <div className="text-xs font-bold text-white leading-tight">{user?.name || 'User'}</div>
            <div className="text-[10px] text-cyan-400 font-mono">{user?.timezone || 'UTC'}</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: PROFILE & TIMEZONE */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800/90 relative overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-500 absolute top-0 left-0" />
        
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-sm">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-white">Identity & Time Calibration</h2>
            <p className="text-xs text-slate-400">Update your public profile handle and timezone alignment</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address (Immutable)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-500 text-sm cursor-not-allowed select-none"
              />
            </div>
          </div>

          {/* Timezone */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Streak Calculation Timezone
              </label>
              <button
                type="button"
                onClick={handleAutoDetectTimezone}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-500/25 transition-all"
              >
                <Globe className="w-3.5 h-3.5" /> Auto-Detect
              </button>
            </div>
            <input
              type="text"
              required
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 font-mono text-xs focus:ring-1 focus:ring-cyan-400"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              StreakForge computes midnight cutoffs strictly in your local timezone to avoid premature streak resets.
            </p>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Display Mode
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex-1 py-3.5 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
                  theme === 'dark'
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Moon className="w-4 h-4 text-cyan-400" />
                <span>Cyber Dark (Recommended)</span>
                {theme === 'dark' && <Check className="w-4 h-4 ml-auto text-cyan-400" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex-1 py-3.5 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
                  theme === 'light'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Solar Light</span>
                {theme === 'light' && <Check className="w-4 h-4 ml-auto text-amber-400" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {savingProfile ? 'Calibrating...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: PASSWORD CHANGE */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800/90 relative overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-500 absolute top-0 left-0" />

        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/25 shadow-sm">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-white">Security & Cryptography</h2>
            <p className="text-xs text-slate-400">Keep your StreakForge credentials bulletproof</p>
          </div>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              New Password (8+ chars, 1 uppercase, 1 number)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword || !currentPassword || !newPassword}
            className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {savingPassword ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* SECTION 3: DATA PORTABILITY & EXPORTS */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800/90 relative overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0" />

        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-white">Data Portability & Archive</h2>
            <p className="text-xs text-slate-400">Download your full habit definitions, frequency schedules, and raw logs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-all hover:-translate-y-1 group">
            <div>
              <div className="flex items-center gap-2.5 text-white font-extrabold text-sm mb-1.5">
                <FileJson className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Full JSON Archive</span>
              </div>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Complete structured dump including habit configurations, target times, and all check-in records.
              </p>
            </div>
            <button
              onClick={() => handleExport('json')}
              disabled={exportingJson}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{exportingJson ? 'Generating JSON...' : 'Export Raw JSON'}</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:-translate-y-1 group">
            <div>
              <div className="flex items-center gap-2.5 text-white font-extrabold text-sm mb-1.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Spreadsheet CSV</span>
              </div>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Excel and Google Sheets compatible audit table with dates, habit titles, and completion booleans.
              </p>
            </div>
            <button
              onClick={() => handleExport('csv')}
              disabled={exportingCsv}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{exportingCsv ? 'Compiling CSV...' : 'Export CSV Table'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: SESSION & SIGN OUT */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl border border-red-500/20 bg-red-500/5 flex items-center justify-between shadow-xl">
        <div>
          <h3 className="text-sm font-extrabold text-red-400">Account Session</h3>
          <p className="text-xs text-slate-400">End your active browser session and revoke JWT authentication cookies</p>
        </div>
        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/30 transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

