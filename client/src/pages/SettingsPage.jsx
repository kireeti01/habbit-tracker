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
      toast.success(`Detected: ${detected}`);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await userApi.updateProfile({ name, timezone, theme });
      setUser(res.data.user);
      toast.success('Profile settings updated!');
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
      toast.success('Password changed successfully!');
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
      toast.success(`Exported ${format.toUpperCase()} successfully!`);
    } catch (err) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    } finally {
      if (format === 'json') setExportingJson(false);
      if (format === 'csv') setExportingCsv(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Profile & Preferences</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your account credentials, timezone alignment, and data exports.
        </p>
      </div>

      {/* SECTION 1: PROFILE & TIMEZONE */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Personal Information</h2>
            <p className="text-xs text-slate-400">Update your public profile and time alignment</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Timezone */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                User Timezone
              </label>
              <button
                type="button"
                onClick={handleAutoDetectTimezone}
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" /> Auto-Detect
              </button>
            </div>
            <input
              type="text"
              required
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-500 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Used by the streak engine to define calendar boundaries (e.g. America/New_York, Europe/London, Asia/Kolkata).
            </p>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Appearance Theme
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-brand-500/15 text-brand-300 border-brand-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Moon className="w-4 h-4 text-brand-400" />
                <span>Dark Slate (Recommended)</span>
                {theme === 'dark' && <Check className="w-3.5 h-3.5 ml-auto text-brand-400" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  theme === 'light'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
                {theme === 'light' && <Check className="w-3.5 h-3.5 ml-auto text-amber-400" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
            >
              {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: PASSWORD CHANGE */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Security & Password</h2>
            <p className="text-xs text-slate-400">Ensure your StreakForge account is fortified</p>
          </div>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              New Password (8+ chars, 1 uppercase, 1 number)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword || !currentPassword || !newPassword}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
          >
            {savingPassword ? 'Updating Password...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* SECTION 3: DATA PORTABILITY & EXPORTS */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Data Portability & Export</h2>
            <p className="text-xs text-slate-400">Download your full habit archive and check-in history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                <FileJson className="w-4 h-4 text-brand-400" />
                <span>Full JSON Backup</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Complete structured dump including habit configurations, frequencies, and raw logs.
              </p>
            </div>
            <button
              onClick={() => handleExport('json')}
              disabled={exportingJson}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exportingJson ? 'Generating JSON...' : 'Export JSON'}</span>
            </button>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Spreadsheet CSV</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Excel and Google Sheets compatible table of every check-in date and completion status.
              </p>
            </div>
            <button
              onClick={() => handleExport('csv')}
              disabled={exportingCsv}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exportingCsv ? 'Generating CSV...' : 'Export CSV'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: SESSION & SIGN OUT */}
      <div className="glass-card p-6 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-red-400">Account Session</h3>
          <p className="text-xs text-slate-400">End your active browser session and clear tokens</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl text-xs font-bold text-red-300 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/30 transition-all flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
