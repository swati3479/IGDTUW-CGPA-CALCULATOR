/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Semester } from '../types';
import { cgpaToPercentage, getSpiritedFeedback, truncateToDecimals } from '../utils/gradeCalculation';
import { Trash2, Plus, Calendar, Award, FileText, AlertCircle, RefreshCw } from 'lucide-react';

interface MultiSemesterTrackerProps {
  savedSemesters: Semester[];
  onDeleteSemester: (id: string) => void;
  onClearAllSemesters: () => void;
  onAddCustomSemester: (name: string, sgpa: number, credits: number) => void;
}

export default function MultiSemesterTracker({
  savedSemesters,
  onDeleteSemester,
  onClearAllSemesters,
  onAddCustomSemester,
}: MultiSemesterTrackerProps) {
  // Manual Input State
  const [customName, setCustomName] = useState('');
  const [customSgpa, setCustomSgpa] = useState('');
  const [customCredits, setCustomCredits] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // Compute overall statistics
  const [stats, setStats] = useState({
    cgpa: 0,
    totalCredits: 0,
    semesterCount: 0,
    valid: false
  });

  useEffect(() => {
    let totalWeightedPoints = 0;
    let sumCredits = 0;
    let count = 0;

    savedSemesters.forEach((sem) => {
      const semSgpa = parseFloat(sem.sgpa.toString());
      const semCredits = parseFloat(sem.totalCredits.toString());

      if (!isNaN(semSgpa) && !isNaN(semCredits) && semCredits > 0) {
        totalWeightedPoints += semSgpa * semCredits;
        sumCredits += semCredits;
        count++;
      }
    });

    const finalCgpa = sumCredits > 0 ? totalWeightedPoints / sumCredits : 0;

    setStats({
      cgpa: finalCgpa,
      totalCredits: sumCredits,
      semesterCount: count,
      valid: sumCredits > 0
    });
  }, [savedSemesters]);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validate name
    const nameStr = customName.trim() || `Semester ${savedSemesters.length + 1}`;
    
    // Validate SGPA
    const sgpaVal = parseFloat(customSgpa);
    if (isNaN(sgpaVal) || sgpaVal < 0 || sgpaVal > 10) {
      setLocalError('SGPA must be a valid number between 0.00 and 10.00.');
      return;
    }

    // Validate Credits
    const creditsVal = parseFloat(customCredits);
    if (isNaN(creditsVal) || creditsVal <= 0 || creditsVal > 40) {
      setLocalError('Credits must be a positive number (up to 40).');
      return;
    }

    onAddCustomSemester(nameStr, sgpaVal, creditsVal);
    
    // Reset manual inputs
    setCustomName('');
    setCustomSgpa('');
    setCustomCredits('');
  };

  const feedback = getSpiritedFeedback(stats.valid ? stats.cgpa : 0);

  return (
    <div className="grid lg:grid-cols-12 gap-6" id="multi-sem-container">
      
      {/* Left Column: Form & Analytics */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Statistics Gauge Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-950 dark:to-slate-900 rounded-2xl p-6 text-white dark:text-slate-100 border border-transparent dark:border-slate-800 shadow-sm relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
            <Award className="h-44 w-44" />
          </div>

          <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-100 opacity-90 flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Cumulative Dashboard
          </h3>
          
          <div className="mt-8 mb-4">
            <span className="text-xs text-indigo-100 block opacity-85 font-medium">Aggregate CGPA</span>
            <span className="text-5xl font-black block mt-1 tracking-tight">
              {stats.valid ? truncateToDecimals(stats.cgpa, 4) : "0.0000"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-550/40">
            <div>
              <span className="text-xs text-indigo-100 opacity-75 block">Total Credits</span>
              <span className="text-lg font-bold">{stats.totalCredits}</span>
            </div>
            <div>
              <span className="text-xs text-indigo-100 opacity-75 block">Equivalent %</span>
              <span className="text-lg font-bold">
                {stats.valid ? `${truncateToDecimals(cgpaToPercentage(stats.cgpa), 2)}%` : "0.00%"}
              </span>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-white/10 rounded-xl">
            <p className="text-xs text-indigo-100 italic leading-relaxed font-medium">
              "{feedback.text}"
            </p>
          </div>
        </div>

        {/* Quick Add Semester Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
            <span>➕</span> Log Previous Semester
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 leading-relaxed">
            Record semesters from prior grading cycles in one click.
          </p>

          {localError && (
            <div className="p-3 mb-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold flex items-start gap-1">
              <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
              <span>{localError}</span>
            </div>
          )}

          <form onSubmit={handleAddCustom} className="space-y-3.5">
            <div>
              <label htmlFor="custom-name" className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Semester Name (Optional)
              </label>
              <input
                id="custom-name"
                type="text"
                placeholder="e.g. 1st Semester, 2025 Winter"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full text-sm bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none font-medium dark:text-white"
                aria-label="Custom semester identifier"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="custom-sgpa" className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  SGPA (0 - 10)
                </label>
                <input
                  id="custom-sgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  placeholder="e.g. 8.72"
                  value={customSgpa}
                  onChange={(e) => setCustomSgpa(e.target.value)}
                  className="w-full text-sm font-semibold bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none dark:text-white"
                  aria-label="Semester Grade Point Average scored"
                />
              </div>

              <div>
                <label htmlFor="custom-credits" className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Credits (1 - 40)
                </label>
                <input
                  id="custom-credits"
                  type="number"
                  step="0.5"
                  min="1"
                  max="40"
                  required
                  placeholder="e.g. 22"
                  value={customCredits}
                  onChange={(e) => setCustomCredits(e.target.value)}
                  className="w-full text-sm bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none font-medium dark:text-white"
                  aria-label="Total credits assigned this academic cycle"
                />
              </div>
            </div>

            <button
              id="add-custom-sem-btn"
              type="submit"
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add Record
            </button>
          </form>
        </div>

      </div>

      {/* Right Column: Semesters Log Grid */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        
        {/* Header toolbar */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <div>
              <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                Semester Record Log
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Review and manage logs. Academic SGPA aggregates are weighted by their individual credits.
              </p>
            </div>

            {savedSemesters.length > 0 && (
              <button
                id="clear-all-sems-btn"
                onClick={onClearAllSemesters}
                className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 py-1 px-2.5 rounded-lg border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50 transition-all cursor-pointer"
                title="Wipe entire offline history log"
              >
                Clear All Logs
              </button>
            )}
          </div>

          {/* List display */}
          {savedSemesters.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl p-6">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No Semester Records Listed</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1 leading-relaxed">
                Use the "Semester Grade Card Estimator" tab and save your scores, or log previous inputs manually.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
              {savedSemesters.map((sem) => (
                <div
                  key={sem.id}
                  className="group bg-slate-50/70 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-slate-700/80 rounded-2xl p-4.5 transition-all flex flex-col justify-between relative"
                >
                  {/* Delete Hover Button */}
                  <button
                    id={`delete-sem-${sem.id}`}
                    onClick={() => onDeleteSemester(sem.id)}
                    className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 border border-transparent hover:border-slate-200 dark:hover:border-rose-900/50 cursor-pointer"
                    aria-label={`Delete record for ${sem.name}`}
                    title="Delete record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block font-mono">
                      ACADEMIC TERM
                    </span>
                    <h4 className="text-md font-bold text-slate-800 dark:text-slate-200 mt-1 uppercase">
                      {sem.name}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">Semester SGPA</span>
                        <p className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                          {truncateToDecimals(parseFloat(sem.sgpa.toString()), 4)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">Credits Used</span>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                          {sem.totalCredits}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                      PEAK STANDING
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {truncateToDecimals(cgpaToPercentage(sem.sgpa), 2)}% Conversion
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Academic disclaimer info */}
        {savedSemesters.length > 0 && (
          <div className="mt-6 p-4 bg-orange-50/50 dark:bg-amber-950/10 rounded-xl border border-orange-100 dark:border-amber-900/30 flex items-start gap-2.5">
            <span className="text-lg shrink-0">💡</span>
            <p className="text-xs text-orange-800 dark:text-amber-400/80 leading-relaxed font-medium">
              <strong>Calculation Note:</strong> Simply averaging semester SGPAs can yield inaccurate CGPA values if semester credits differ. Our calculator adheres to UGC rules, calculating a true weighted average across all {stats.semesterCount} registered sem credits.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
