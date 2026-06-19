/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Semester, Subject } from './types';
import SGPACalculator from './components/SGPACalculator';
import MultiSemesterTracker from './components/MultiSemesterTracker';
import CGPAConverter from './components/CGPAConverter';
import PolicySheet from './components/PolicySheet';
import ThemeToggle from './components/ThemeToggle';
import { AnimatePresence, motion } from 'motion/react';
import { Calculator, Award, Percent, BookOpen, GraduationCap, Github, Heart, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sgpa-calc' | 'multi-tracker' | 'converter' | 'policy'>('sgpa-calc');

  // Load and save semesters state in localStorage for persistent offline capability
  const [savedSemesters, setSavedSemesters] = useState<Semester[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('igdtuw-calculator-semesters');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse saved semesters:', e);
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('igdtuw-calculator-semesters', JSON.stringify(savedSemesters));
  }, [savedSemesters]);

  const handleSaveSemester = (name: string, subjects: Subject[], sgpa: number, totalCredits: number) => {
    const newSemester: Semester = {
      id: crypto.randomUUID(),
      name,
      subjects,
      sgpa,
      totalCredits,
    };
    setSavedSemesters((prev) => {
      // Overwrite if exact semester name exists
      const filtered = prev.filter((s) => s.name.trim().toLowerCase() !== name.trim().toLowerCase());
      return [...filtered, newSemester];
    });
  };

  const handleDeleteSemester = (id: string) => {
    setSavedSemesters((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearAllSemesters = () => {
    setSavedSemesters([]);
  };

  const handleAddCustomSemester = (name: string, sgpa: number, credits: number) => {
    const newSemester: Semester = {
      id: crypto.randomUUID(),
      name,
      subjects: [],
      sgpa,
      totalCredits: credits,
    };
    setSavedSemesters((prev) => [...prev, newSemester]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500/10 transition-colors duration-200">
      
      {/* Primary Accessible Skip Link */}
      <a href="#main-calculator-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md z-50">
        Skip to main content
      </a>

      {/* Main Structural Header */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo / Title Area */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 dark:from-indigo-550 dark:to-violet-550 flex items-center justify-center text-white shadow-sm ring-4 ring-indigo-50 dark:ring-slate-900">
              <GraduationCap className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 id="app-site-heading" className="text-md sm:text-lg font-black tracking-tight text-slate-900 dark:text-slate-50 uppercase flex items-center gap-1">
                IGDTUW <span className="text-indigo-600 dark:text-indigo-400 font-medium">Calculator</span>
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider -mt-0.5">
                Official grading policy matrix
              </p>
            </div>
          </div>

          {/* Configuration utility buttons */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>

        </div>
      </header>

      {/* Main Body Grid */}
      <main id="main-calculator-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        
        {/* Banner Announcement for Students */}
        <div className="mb-8 p-4 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/40 dark:border-indigo-900/40 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5" role="img" aria-label="Announcement">📢</span>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">IGDTUW Evaluator Portal Updates</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mt-1 sm:mt-0 max-w-2xl leading-relaxed">
                Estimate SGPAs instantly by editing row marks or credit points. Convert cumulative SGPA/CGPA directly to corporate percentage values below.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs menu */}
        <nav aria-label="Calculator functional menus" className="mb-8 overflow-x-auto">
          <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-px">
            <button
              id="tab-sgpa-calc"
              onClick={() => setActiveTab('sgpa-calc')}
              className={`px-4.5 py-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'sgpa-calc'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
              aria-selected={activeTab === 'sgpa-calc'}
              role="tab"
            >
              <Calculator className="h-4 w-4" />
              <span>Semester SGPA</span>
            </button>

            <button
              id="tab-multi-tracker"
              onClick={() => setActiveTab('multi-tracker')}
              className={`px-4.5 py-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer relative ${
                activeTab === 'multi-tracker'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
              aria-selected={activeTab === 'multi-tracker'}
              role="tab"
            >
              <Award className="h-4 w-4" />
              <span>CGPA Multi-Tracker</span>

              {savedSemesters.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-black">
                  {savedSemesters.length}
                </span>
              )}
            </button>

            <button
              id="tab-converter"
              onClick={() => setActiveTab('converter')}
              className={`px-4.5 py-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'converter'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
              aria-selected={activeTab === 'converter'}
              role="tab"
            >
              <Percent className="h-4 w-4" />
              <span>CGPA to Percentage</span>
            </button>

            <button
              id="tab-policy"
              onClick={() => setActiveTab('policy')}
              className={`px-4.5 py-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'policy'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
              aria-selected={activeTab === 'policy'}
              role="tab"
            >
              <BookOpen className="h-4 w-4" />
              <span>Grading Regulations</span>
            </button>
          </div>
        </nav>

        {/* Tab Panel Renderings with Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            id="tab-content-panel"
            role="tabpanel"
          >
            {activeTab === 'sgpa-calc' && (
              <SGPACalculator onSaveSemester={handleSaveSemester} />
            )}

            {activeTab === 'multi-tracker' && (
              <MultiSemesterTracker
                savedSemesters={savedSemesters}
                onDeleteSemester={handleDeleteSemester}
                onClearAllSemesters={handleClearAllSemesters}
                onAddCustomSemester={handleAddCustomSemester}
              />
            )}

            {activeTab === 'converter' && (
              <CGPAConverter />
            )}

            {activeTab === 'policy' && (
              <PolicySheet />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Descriptive SEO / Marketing Content Footer landmark */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-850 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-8">
            
            {/* Branding detail */}
            <div className="md:col-span-5 space-y-3">
              <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest block">
                IGDTUW CGPA Platform
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                Indira Gandhi Delhi Technical University for Women is an independent girls-only engineering and tech institution. Our calculator helps simplify academic tracking across B.Tech, MCA, and PhD systems.
              </p>
              
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide">
                <Heart className="h-3.5 w-3.5 fill-current animate-pulse text-rose-500" />
                <span>Empowering Women in Technology and Leadership</span>
              </div>
            </div>

            {/* Practical Quick Links block */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Academic Portals
              </span>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-350">
                <li>
                  <a href="https://www.igdtuw.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-all flex items-center gap-1">
                    University Main Website 
                    <span className="text-[10px] text-slate-450">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.igdtuw.ac.in/academics/scheme-syllabus" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-all flex items-center gap-1">
                    IGDTUW Syllabus Sheets
                    <span className="text-[10px] text-slate-450">↗</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* SEO Keyword footer details */}
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Academic Compliance
              </span>
              <p className="text-[11px] text-slate-450 dark:text-slate-500 leading-normal">
                This utility application calculates grade projections and equivalents based on the official Credit system outlined in the university syllabus handbook. Re-verifications must be processed through official university transcript sheets.
              </p>

              <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 mt-2">
                LATITUDE: 28.6657° N | LONGITUDE: 77.2341° E (Kashmere Gate, Delhi)
              </div>
            </div>

          </div>

          <div className="border-t border-slate-100 dark:border-slate-900/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-450 dark:text-slate-500 font-medium">
            <span>© 2026 IGDTUW Student Community. All rights reserved.</span>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <span>Open-Source Compliance</span>
              <span>•</span>
              <span>UGC Scheme Compliant</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
