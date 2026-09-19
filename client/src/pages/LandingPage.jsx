import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  Calendar,
  Award,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Check,
  Star,
  Clock,
  Smartphone,
  ChevronDown,
  Layers,
  BarChart3,
  Activity,
} from 'lucide-react';
import HeroPhoneMockup from '../components/landing/HeroPhoneMockup';
import InteractiveSandbox from '../components/landing/InteractiveSandbox';
import AnimatedStreakHeatmap from '../components/landing/AnimatedStreakHeatmap';
import InteractiveAICoachDemo from '../components/landing/InteractiveAICoachDemo';
import LiveMomentumTicker from '../components/landing/LiveMomentumTicker';

export default function LandingPage() {
  const [activeDemoTab, setActiveDemoTab] = useState('sandbox');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const coreFeatures = [
    {
      icon: Flame,
      color: 'text-orange-400',
      border: 'hover:border-orange-500/50',
      bg: 'bg-orange-500/10 border-orange-500/20',
      title: 'Timezone Streak Engine',
      desc: 'Smart circadian reset protects your streaks across travel and rest days.',
    },
    {
      icon: Bot,
      color: 'text-cyan-400',
      border: 'hover:border-cyan-500/50',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      title: 'Personalized AI Coach',
      desc: 'Gemini AI analyzes adherence patterns to build tailored micro-habit plans.',
    },
    {
      icon: Calendar,
      color: 'text-emerald-400',
      border: 'hover:border-emerald-500/50',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      title: '365-Day Visual Heatmap',
      desc: 'GitHub-style yearly consistency matrices celebrate every single day.',
    },
  ];

  const faqs = [
    {
      q: 'How does timezone-aware streak preservation work?',
      a: 'Unlike apps that reset at UTC midnight, StreakForge anchors to your local clock so travel and late evenings never wipe out active streaks.',
    },
    {
      q: 'Can I track habits with custom day-off schedules?',
      a: 'Yes! Configure custom intervals like Mon/Wed/Fri or alternate days. Scheduled rest days never break your streak count.',
    },
    {
      q: 'Is StreakForge completely free to start?',
      a: 'Yes! Core habit tracking, streak preservation, and heatmaps are 100% free forever without a credit card.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-40 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[160px]" />
      </div>

      {/* 1. High-Impact Hero Section */}
      <section className="relative z-10 pt-8 pb-14 lg:pt-14 lg:pb-20 overflow-hidden">
        {/* Visual 3D Habit Analytics Artwork */}
        <div className="absolute inset-0 pointer-events-none -z-10 opacity-35 lg:opacity-40 mix-blend-screen overflow-hidden">
          <img
            src="/habit_tech_background.jpg"
            alt="3D Habit Tracker Analytics & Streak Matrix"
            className="w-full h-full object-cover object-center transform scale-105 filter saturate-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-transparent to-[#070b14]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left: 3D Typography & CTA */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              {/* Category Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1629]/90 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.25)] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Habit &amp; Streak Tracker</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Build Better Habits,{' '}
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400 text-3d-glow">
                  Conquer Your Days.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-lg max-w-lg leading-relaxed font-normal">
                Track progress, maintain streaks, and achieve consistency with our intuitive app.
                Powered by timezone resilience, heatmaps, and personalized AI coaching.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto pt-1">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 text-base font-extrabold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl border-2 border-cyan-400/90 glow-purple-btn hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-500 rounded-2xl transition-all shadow-md backdrop-blur-md flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                </Link>
              </div>
            </div>

            {/* Right: Interactive 3D Phone Chassis */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <HeroPhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Momentum Ticker */}
      <LiveMomentumTicker />

      {/* 3. Consolidated Interactive Experience Hub (Tabs) */}
      <section id="demo" className="relative z-10 py-12 sm:py-16 bg-[#050811]/90 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1.5">
              Interactive Showcase
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Test the Streak Engine in Action
            </p>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
              Experience the core features directly in your browser without logging in.
            </p>
          </div>

          {/* Tab Navigation Controls */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 flex-wrap">
            <button
              onClick={() => setActiveDemoTab('sandbox')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeDemoTab === 'sandbox'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-200" />
              <span>⚡ Live Sandbox</span>
            </button>

            <button
              onClick={() => setActiveDemoTab('heatmap')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeDemoTab === 'heatmap'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-200" />
              <span>📊 365-Day Matrix</span>
            </button>

            <button
              onClick={() => setActiveDemoTab('ai-coach')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeDemoTab === 'ai-coach'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Bot className="w-4 h-4 text-purple-200" />
              <span>🤖 AI Coach Demo</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="transition-all duration-300">
            {activeDemoTab === 'sandbox' && <InteractiveSandbox />}
            {activeDemoTab === 'heatmap' && <AnimatedStreakHeatmap />}
            {activeDemoTab === 'ai-coach' && <InteractiveAICoachDemo />}
          </div>
        </div>
      </section>

      {/* 4. Core Features & Architecture */}
      <section id="features" className="relative z-10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {coreFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className={`group relative rounded-2xl bg-[#0e1628]/70 border border-slate-800 p-6 transition-all duration-300 ${f.border} hover:-translate-y-1 backdrop-blur-md`}
                >
                  <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5 tracking-tight">{f.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Combined Pricing & FAQ Section */}
      <section id="pricing" className="relative z-10 py-12 sm:py-16 bg-[#050811]/90 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Compact Pricing (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Pricing</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Start Free, Upgrade When Ready</h2>
              </div>

              {/* Free vs Pro compact card */}
              <div className="rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#090e1c] border-2 border-cyan-500/40 p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <div className="text-base font-bold text-white">Starter Plan</div>
                    <div className="text-xs text-slate-400">Full core features forever</div>
                  </div>
                  <div className="text-2xl font-black text-cyan-400">$0</div>
                </div>

                <div className="pt-4 pb-2 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Timezone-resilient streak engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>365-day GitHub-style heatmap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Milestone badges &amp; XP progression</span>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-extrabold text-xs text-center text-white flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: Compact FAQ (7 Cols) */}
            <div id="faq" className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Questions</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-[#0e1628]/80 border border-slate-800 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-white hover:text-cyan-300 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2.5">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Clean Sleek Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#050811] py-8 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-cyan-500/20 border border-orange-500/30">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              </div>
              <div className="flex items-baseline font-bold text-sm text-white">
                <span>Streak</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Forge</span>
              </div>
              <span className="text-slate-500 pl-2">| Built for growth</span>
            </div>

            {/* Anchor Links */}
            <div className="flex items-center gap-5 text-slate-400 text-xs">
              <a href="#features" className="hover:text-cyan-300 transition-colors">Features</a>
              <a href="#demo" className="hover:text-cyan-300 transition-colors">Demo</a>
              <a href="#pricing" className="hover:text-cyan-300 transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-cyan-300 transition-colors">FAQ</a>
            </div>

            {/* Copyright */}
            <p className="text-slate-500">&copy; {new Date().getFullYear()} StreakForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

