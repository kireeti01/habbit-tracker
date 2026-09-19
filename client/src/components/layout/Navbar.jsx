import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Flame,
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Activity,
  Check,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const authenticatedNavLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Habits', path: '/habits', icon: CheckSquare },
    { name: 'AI Coach', path: '/ai-coach', icon: Sparkles, badge: 'AI' },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const publicNavLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Live Demo', href: '#demo' },
    { name: 'Why StreakForge', href: '#why-us' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Support', href: '#faq' },
  ];

  const handleAnchorClick = (e, href) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#070b14]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
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


          {/* Desktop Navigation Links */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center gap-1">
              {authenticatedNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              {publicNavLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="hover:text-cyan-300 transition-colors py-1"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-medium max-w-[120px] truncate">{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-900/80 transition-colors border border-slate-800/80"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-cyan-400/50 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#080d18]/95 px-4 pt-3 pb-5 space-y-2 backdrop-blur-xl">
          {isAuthenticated ? (
            <>
              {authenticatedNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between px-2">
                <span className="text-xs text-slate-400 truncate">{user?.email}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              {publicNavLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    handleAnchorClick(e, item.href);
                    setMobileMenuOpen(false);
                  }}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-900"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-medium text-slate-200 bg-slate-900 border border-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 border border-cyan-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  Get Started Free
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}

