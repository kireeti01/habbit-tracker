import React from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-400 mb-4 border border-orange-500/20">
        <Flame className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-2">404 - Page Not Found</h1>
      <p className="text-slate-400 text-sm max-w-md mb-6">
        The streak you are looking for has taken a detour. Let&apos;s return to the forge.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
