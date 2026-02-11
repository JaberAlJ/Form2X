'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, BookOpen, ArrowRight, Zap, ShieldCheck, Cpu, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function LandingPage() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering once mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden" />
    );
  }

  const isDarkMode = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-full border border-slate-200 dark:border-slate-800 shadow-xl hover:scale-105 active:scale-95 transition-all text-slate-600 dark:text-slate-400"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/50 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap className="w-3 h-3" /> The Next Evolution of Form2
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Form2<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">X</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
            A modular suite of hyper-structured document generators.
            Convert simple forms into high-fidelity, industry-standard outputs with precision and speed.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
            <div className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">ATS Optimized</span>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center gap-3">
              <Cpu className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">LaTeX Engine</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Form2Resume Card */}
          <Link href="/resume" className="group relative block animate-in fade-in slide-in-from-left-8 duration-1000 delay-400">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-500/50 group-hover:border-blue-500/50 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                <FileText className="w-32 h-32" />
              </div>

              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Form2Resume</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-[280px]">
                Create professional, ATS-optimized resumes in minutes. Built for engineers and professionals.
              </p>

              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-2 transition-transform duration-300">
                Start Building <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Form2Research Card */}
          <Link href="/research" className="group relative block animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-500/50 group-hover:border-indigo-500/50 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                <BookOpen className="w-32 h-32" />
              </div>

              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Form2Research</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-[280px]">
                Generate IEEE standard research papers with LaTeX equations, figures, and automatic citations.
              </p>

              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-2 transition-transform duration-300">
                Start Drafting <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        <footer className="mt-32 pt-12 border-t border-slate-200 dark:border-slate-800 text-center animate-in fade-in duration-1000 delay-700">
          <p className="text-sm text-slate-400 dark:text-slate-600">
            © {new Date().getFullYear()} Form2X. Modern Modular Documentation.
          </p>
        </footer>
      </main>
    </div>
  );
}
