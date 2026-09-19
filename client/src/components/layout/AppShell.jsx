import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Cyber-grid backdrop */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

