import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Brain,
  Send,
  Plus,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Check,
  Flame,
  Calendar,
} from 'lucide-react';
import { aiApi } from '../api/aiApi';
import { useHabitStore } from '../store/habitStore';
import toast from 'react-hot-toast';

export default function AICoachPage() {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'insights' | 'chat'
  const { createHabit } = useHabitStore();

  // Generator State
  const [goalInput, setGoalInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [adoptedMap, setAdoptedMap] = useState({});

  // Insights State
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I am **ForgeBot**, your AI behavioral science coach. I have full context on your habits and active streaks. How can I assist your momentum today?",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatting, setChatting] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatting]);

  // Load weekly insight if tab opened
  useEffect(() => {
    if (activeTab === 'insights' && !insight) {
      fetchWeeklyInsight();
    }
  }, [activeTab]);

  const fetchWeeklyInsight = async (force = false) => {
    setLoadingInsight(true);
    try {
      const res = await aiApi.getWeeklyInsight(force);
      setInsight(res.data);
    } catch (err) {
      toast.error('Failed to generate weekly coach report');
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleGenerateHabits = async (e) => {
    e?.preventDefault();
    if (!goalInput.trim()) return;

    setGeneratingSuggestions(true);
    try {
      const res = await aiApi.suggestHabits(goalInput.trim());
      setSuggestions(res.data || []);
      toast.success('Generated habit blueprints!');
    } catch (err) {
      toast.error('Failed to generate habits. Please try again.');
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const handleAdoptHabit = async (suggestion, index) => {
    try {
      const res = await createHabit({
        title: suggestion.title,
        description: suggestion.description,
        category: suggestion.category,
        frequency: suggestion.frequency,
        color: suggestion.color,
        icon: suggestion.icon,
      });

      if (res.success) {
        setAdoptedMap((prev) => ({ ...prev, [index]: true }));
        toast.success(`Adopted "${suggestion.title}" into your habits! 🔥`);
      }
    } catch (err) {
      toast.error('Failed to add habit');
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || chatting) return;

    const userText = chatInput.trim();
    setChatInput('');

    const newHistory = [...chatMessages, { role: 'user', text: userText }];
    setChatMessages(newHistory);
    setChatting(true);

    try {
      // Map history for backend
      const formattedHistory = newHistory.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await aiApi.chat(userText, formattedHistory.slice(0, -1));
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: res.data?.reply || 'Keep pushing forward!' },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "I encountered a minor network hiccup, but remember: consistency in showing up is what truly counts!",
        },
      ]);
    } finally {
      setChatting(false);
    }
  };

  const quickGoals = [
    'Get fit, run 3x weekly, and sleep better',
    'Master coding and build deep work discipline',
    'Reduce phone screen time and meditate daily',
    'Drink 3L water and eat clean whole foods',
  ];

  const quickChatPrompts = [
    'How do I overcome low motivation today?',
    'What is the 2-minute rule for habits?',
    'How can I recover after missing a scheduled day?',
    'Explain habit stacking with an example.',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Behavioral Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">AI Habit Coach</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Personalized habit blueprint synthesis, 30-day behavioral adherence analytics, and conversational coaching.
          </p>
        </div>
      </div>

      {/* Modern Glowing Tabs */}
      <div className="flex border-b border-slate-800 gap-3 pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('generator')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'generator'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-cyan-400/50 scale-105'
              : 'bg-[#0c1322]/60 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>Habit Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'insights'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50 scale-105'
              : 'bg-[#0c1322]/60 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
          }`}
        >
          <Brain className="w-4 h-4 text-emerald-200" />
          <span>Weekly Coach Report</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/50 scale-105'
              : 'bg-[#0c1322]/60 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
          }`}
        >
          <Bot className="w-4 h-4 text-cyan-200" />
          <span>ForgeBot Chat Advisor</span>
        </button>
      </div>

      {/* TAB 1: HABIT GENERATOR */}
      {activeTab === 'generator' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#0c1322]/85 border border-slate-800/80 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
            <h2 className="text-lg sm:text-xl font-black text-white mb-1">What goal do you want to forge?</h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Describe your aspiration in plain English. Gemini AI breaks it down into 3-5 atomic, high-impact daily habits.
            </p>

            <form onSubmit={handleGenerateHabits} className="space-y-4">
              <div className="relative">
                <textarea
                  rows={3}
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="e.g. I want to build superhuman energy in the mornings, code 2 hours daily, and master meditation..."
                  className="w-full p-4 rounded-2xl bg-[#080d1a] border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 resize-none transition-all"
                />
              </div>

              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-semibold flex items-center">Inspirations:</span>
                {quickGoals.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGoalInput(q)}
                    className="text-[11px] py-1 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={generatingSuggestions || !goalInput.trim()}
                  className="px-7 py-3 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-cyan-400/60 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {generatingSuggestions ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing Habits...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
                      <span>Generate Habits</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Generated Suggestions Grid */}
          {suggestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-lg text-white">Recommended Habit Blueprints</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {suggestions.map((sugg, idx) => {
                  const isAdopted = !!adoptedMap[idx];
                  return (
                    <div
                      key={idx}
                      className="rounded-3xl bg-[#0c1322]/85 border border-slate-800/90 p-6 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all relative overflow-hidden shadow-xl backdrop-blur-xl group"
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-1.5"
                        style={{ backgroundColor: sugg.color || '#06b6d4' }}
                      />

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border border-white/10"
                            style={{ backgroundColor: `${sugg.color || '#06b6d4'}25` }}
                          >
                            {sugg.icon || '⚡'}
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 capitalize">
                            {sugg.category}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-base text-white mb-1.5">{sugg.title}</h4>
                        <p className="text-xs text-slate-300 mb-4 leading-relaxed">{sugg.description}</p>

                        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-5 text-xs">
                          <span className="font-bold text-cyan-400 block mb-1 flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5" /> Behavioral Strategy:
                          </span>
                          <span className="text-slate-400 leading-relaxed text-[11px]">{sugg.whyItHelps}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isAdopted}
                        onClick={() => handleAdoptHabit(sugg, idx)}
                        className={`w-full py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md ${
                          isAdopted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95'
                        }`}
                      >
                        {isAdopted ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Adopted to Habits 🔥</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add to My Habits</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WEEKLY INSIGHTS REPORT */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#0c1322]/85 border border-slate-800/80 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">30-Day Behavioral Adherence Report</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesized from your active log patterns &bull; Cached for 24 hours
                </p>
              </div>
              <button
                onClick={() => fetchWeeklyInsight(true)}
                disabled={loadingInsight}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-colors flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loadingInsight ? 'animate-spin' : ''}`} />
                <span>Regenerate Analysis</span>
              </button>
            </div>

            {loadingInsight ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400 animate-pulse">Analyzing 30-day habits and completion trends with Gemini AI...</p>
              </div>
            ) : insight?.content ? (
              <div className="mt-6 space-y-6">
                {/* Score & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
                  <div className="p-6 rounded-3xl bg-gradient-to-b from-[#140f2b] to-[#0a0d1a] border-2 border-purple-500/40 text-center flex flex-col items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.2)]">
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-1">
                      Momentum Score
                    </span>
                    <div className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                      {insight.content.overallScore}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 font-semibold">out of 100</span>
                  </div>

                  <div className="md:col-span-3 p-6 rounded-3xl bg-[#080d1a]/80 border border-slate-800">
                    <span className="text-xs font-bold text-slate-300 block mb-1">Executive Analysis</span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{insight.content.summary}</p>
                    <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px] font-semibold">Peak Days:</span>
                        <span className="text-emerald-400 font-bold">
                          {(insight.content.bestDays || []).join(', ') || 'Consistent'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] font-semibold">Vulnerable Days:</span>
                        <span className="text-amber-400 font-bold">
                          {(insight.content.weakDays || []).join(', ') || 'None identified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Working vs Slipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/25">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-sm text-emerald-400">Strengths &amp; High Adherence</h4>
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {(insight.content.workingWell || []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5 stroke-[3]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/25">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <h4 className="font-bold text-sm text-amber-400">Friction Points &amp; Risks</h4>
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {(insight.content.slipping || []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actionable Tips */}
                <div className="p-6 rounded-3xl bg-[#080d1a]/80 border border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-sm text-white">3 High-Leverage Strategic Tweaks</h4>
                  </div>
                  <div className="space-y-3">
                    {(insight.content.actionableTips || []).map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#0c1322] border border-slate-800 text-xs text-slate-300 flex items-start gap-3.5"
                      >
                        <span className="w-6 h-6 rounded-xl bg-cyan-500/20 text-cyan-300 font-extrabold text-xs flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                Click &ldquo;Regenerate Analysis&rdquo; to analyze your 30-day logs.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AI CHAT COACH */}
      {activeTab === 'chat' && (
        <div className="rounded-3xl bg-[#0c1322]/85 border border-slate-800/80 overflow-hidden flex flex-col h-[620px] shadow-2xl backdrop-blur-xl">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#070c18] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <span>ForgeBot</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-slate-400">Context-aware behavioral science advisor</p>
              </div>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              Gemini AI Powered
            </span>
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                      ⚡
                    </div>
                  )}
                  <div
                    className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                        : 'bg-[#080d1a] border border-slate-700/80 text-slate-200 rounded-bl-none shadow-md'
                    }`}
                  >
                    {msg.text.split('\n').map((line, lIdx) => (
                      <p key={lIdx} className={lIdx > 0 ? 'mt-2' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}

            {chatting && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                  ⚡
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-800">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Chat Prompts */}
          <div className="px-4 py-2.5 bg-[#070c18] border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] text-slate-500 font-semibold flex-shrink-0">Ask:</span>
            {quickChatPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setChatInput(q)}
                className="text-[11px] py-1 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-800 bg-[#070b14] flex gap-2.5">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask ForgeBot anything about habit formation, atomic routines, or streak recovery..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#080d1a] border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={chatting || !chatInput.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all disabled:opacity-50 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

