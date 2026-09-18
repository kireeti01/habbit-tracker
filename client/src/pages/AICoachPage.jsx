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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Behavioral Intelligence Layer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Coach & Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1">
            Personalized habit synthesis, 30-day behavioral analysis, and conversational coaching.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('generator')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'generator'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Habit Generator</span>
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'insights'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Weekly Coach Report</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'chat'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>ForgeBot Chat Coach</span>
        </button>
      </div>

      {/* TAB 1: HABIT GENERATOR */}
      {activeTab === 'generator' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-1">What goal do you want to forge?</h2>
            <p className="text-xs text-slate-400 mb-4">
              Describe your aspiration in plain English. The AI breaks it down into 3-5 atomic, high-impact habits.
            </p>

            <form onSubmit={handleGenerateHabits} className="space-y-3">
              <div className="relative">
                <textarea
                  rows={3}
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="e.g. I want to feel more energetic in the mornings, read regularly, and reduce anxiety..."
                  className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-slate-500 flex items-center">Quick inspirations:</span>
                {quickGoals.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGoalInput(q)}
                    className="text-[11px] py-1 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={generatingSuggestions || !goalInput.trim()}
                  className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {generatingSuggestions ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing Habits...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
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
              <h3 className="font-bold text-base text-white">Recommended Habit Blueprints</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestions.map((sugg, idx) => {
                  const isAdopted = !!adoptedMap[idx];
                  return (
                    <div
                      key={idx}
                      className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all relative overflow-hidden"
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{ backgroundColor: sugg.color || '#6366F1' }}
                      />

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                            style={{ backgroundColor: `${sugg.color || '#6366F1'}20` }}
                          >
                            {sugg.icon || '⚡'}
                          </div>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 capitalize">
                            {sugg.category}
                          </span>
                        </div>

                        <h4 className="font-bold text-base text-white mb-1">{sugg.title}</h4>
                        <p className="text-xs text-slate-300 mb-3">{sugg.description}</p>

                        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-4 text-[11px]">
                          <span className="font-semibold text-brand-400 block mb-0.5 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" /> Why it helps:
                          </span>
                          <span className="text-slate-400 leading-relaxed">{sugg.whyItHelps}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isAdopted}
                        onClick={() => handleAdoptHabit(sugg, idx)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isAdopted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20'
                        }`}
                      >
                        {isAdopted ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Adopted to Habits</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
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
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">30-Day Behavioral Insight Report</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesized from your historical log patterns &bull; Cached for 24 hours
                </p>
              </div>
              <button
                onClick={() => fetchWeeklyInsight(true)}
                disabled={loadingInsight}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingInsight ? 'animate-spin' : ''}`} />
                <span>Regenerate Report</span>
              </button>
            </div>

            {loadingInsight ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400 animate-pulse">Analyzing 30-day habits and completion trends...</p>
              </div>
            ) : insight?.content ? (
              <div className="mt-6 space-y-6">
                {/* Score & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-950 to-slate-900 border border-brand-500/20 text-center flex flex-col items-center justify-center">
                    <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-1">
                      Momentum Score
                    </span>
                    <div className="text-4xl sm:text-5xl font-extrabold text-white">
                      {insight.content.overallScore}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">out of 100</span>
                  </div>

                  <div className="md:col-span-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <span className="text-xs font-bold text-slate-300 block mb-1">Executive Summary</span>
                    <p className="text-sm text-slate-300 leading-relaxed">{insight.content.summary}</p>
                    <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Peak Days:</span>
                        <span className="text-emerald-400 font-semibold">
                          {(insight.content.bestDays || []).join(', ') || 'Consistent'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Vulnerable Days:</span>
                        <span className="text-amber-400 font-semibold">
                          {(insight.content.weakDays || []).join(', ') || 'None identified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Working vs Slipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-sm text-emerald-400">What&apos;s Working Well</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {(insight.content.workingWell || []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <h4 className="font-bold text-sm text-amber-400">Areas For Attention</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {(insight.content.slipping || []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actionable Tips */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-sm text-white">3 High-Leverage Actionable Tweaks</h4>
                  </div>
                  <div className="space-y-2.5">
                    {(insight.content.actionableTips || []).map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                Click &ldquo;Regenerate Report&rdquo; to analyze your 30-day logs.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AI CHAT COACH */}
      {activeTab === 'chat' && (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>ForgeBot</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-slate-400">Context-aware habit & streak advisor</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">AI Intelligence Engine</span>
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatMessages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                      ⚡
                    </div>
                  )}
                  <div
                    className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-br-sm shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-sm'
                    }`}
                  >
                    {/* Render basic bolding and linebreaks */}
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
                <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs">
                  ⚡
                </div>
                <div className="flex items-center gap-1 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Chat Prompts */}
          <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] text-slate-500 flex-shrink-0">Ask:</span>
            {quickChatPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setChatInput(q)}
                className="text-[11px] py-1 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 whitespace-nowrap transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask ForgeBot anything about building habits..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={chatting || !chatInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
