/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Subject } from '../types';
import { calculateSubjectMetrics, getSpiritedFeedback, cgpaToPercentage, calculateGrade, calculateGradePoint, truncateToDecimals } from '../utils/gradeCalculation';
import { Plus, Minus, Trash2, Save, Sparkles, Check, RotateCcw } from 'lucide-react';

interface SGPACalculatorProps {
  onSaveSemester: (name: string, subjects: Subject[], sgpa: number, totalCredits: number) => void;
}

const DEFAULT_SUBJECTS: Subject[] = [
  { id: '1', name: 'Subject 1', marks: '', credits: 4 },
  { id: '2', name: 'Subject 2', marks: '', credits: 4 },
  { id: '3', name: 'Subject 3', marks: '', credits: 3 },
  { id: '4', name: 'Subject 4', marks: '', credits: 3 },
  { id: '5', name: 'Subject 5', marks: '', credits: 2 },
];

export default function SGPACalculator({ onSaveSemester }: SGPACalculatorProps) {
  const [semesterName, setSemesterName] = useState('1st Semester');
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    // Attempt local load tentative draft or load defaults
    return DEFAULT_SUBJECTS;
  });

  const [calcResult, setCalcResult] = useState<{
    sgpa: number;
    totalCredits: number;
    hasCalculated: boolean;
    activeCount: number;
  }>({
    sgpa: 0,
    totalCredits: 0,
    hasCalculated: false,
    activeCount: 0,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateSubjectField = (index: number, field: keyof Subject, value: string | number) => {
    setIsSaved(false);
    setSubjects((prev) => {
      const updated = [...prev];
      const target = { ...updated[index] };

      if (field === 'marks') {
        let marksVal = value.toString();
        // Allow empty
        if (marksVal === '') {
          target.marks = '';
        } else {
          // Limit 0 to 100
          const parsed = parseFloat(marksVal);
          if (!isNaN(parsed)) {
            if (parsed < 0) marksVal = '0';
            if (parsed > 100) marksVal = '100';
            target.marks = parsed;
          } else {
            target.marks = '';
          }
        }
      } else if (field === 'credits') {
        let creditsVal = value.toString();
        if (creditsVal === '') {
          target.credits = '';
        } else {
          const parsed = parseFloat(creditsVal);
          if (!isNaN(parsed)) {
            if (parsed < 0) creditsVal = '0';
            target.credits = parsed;
          } else {
            target.credits = '';
          }
        }
      } else {
        // String name renames
        target[field] = value as string;
      }

      updated[index] = target;
      return updated;
    });
  };

  const addRow = () => {
    setIsSaved(false);
    setSubjects((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `Subject ${prev.length + 1}`,
        marks: '',
        credits: 4,
      },
    ]);
  };

  const removeLastRow = () => {
    setIsSaved(false);
    if (subjects.length > 1) {
      setSubjects((prev) => prev.slice(0, -1));
    } else {
      setValidationError('At least one subject is required.');
      setTimeout(() => setValidationError(null), 3000);
    }
  };

  const clearAllFields = () => {
    setIsSaved(false);
    setSubjects(DEFAULT_SUBJECTS.map(s => ({ ...s, marks: '', credits: 4, id: crypto.randomUUID() })));
    setCalcResult({
      sgpa: 0,
      totalCredits: 0,
      hasCalculated: false,
      activeCount: 0,
    });
  };

  const executeCalculation = () => {
    // Validate that at least one subject has valid input marks and credits
    const hasValidDraft = subjects.some(s => s.marks !== '' && s.credits !== '');
    if (!hasValidDraft) {
      setValidationError('Please enter marks and credits for at least one subject to calculate.');
      setTimeout(() => setValidationError(null), 4000);
      return;
    }

    // Verify credits bounds
    const invalidCredits = subjects.some(s => s.marks !== '' && (s.credits === '' || parseFloat(s.credits.toString()) <= 0));
    if (invalidCredits) {
      setValidationError('Any subject with marks must have a positive credit value.');
      setTimeout(() => setValidationError(null), 4000);
      return;
    }

    const metrics = calculateSubjectMetrics(subjects);
    
    // Set the state elements
    setSubjects(metrics.calculatedSubjects);
    setCalcResult({
      sgpa: metrics.sgpa,
      totalCredits: metrics.totalCredits,
      hasCalculated: true,
      activeCount: metrics.activeSubjectsCount,
    });
    setValidationError(null);
  };

  const handleSave = () => {
    if (!calcResult.hasCalculated) {
      executeCalculation();
    }
    onSaveSemester(semesterName, subjects, calcResult.sgpa, calcResult.totalCredits);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const feedback = getSpiritedFeedback(calcResult.hasCalculated ? calcResult.sgpa : 0);

  return (
    <div id="sgpa-calc-card" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all">
      
      {/* Visual Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <h2 id="sgpa-title" className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">🏫</span>
            Semester Grade Card Estimator
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Input marks and credits below. Grades & points update transparently using IGDTUW conventions.
          </p>
        </div>

        {/* Semester Identifier Box */}
        <div className="flex items-center gap-2">
          <label htmlFor="sem-name-input" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Semester:
          </label>
          <input
            id="sem-name-input"
            type="text"
            value={semesterName}
            onChange={(e) => setSemesterName(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-36 transition-all"
            aria-label="Semester Name or Term label"
          />
        </div>
      </div>

      <div className="p-6">
        {/* Error Alert Bar */}
        {validationError && (
          <div className="mb-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-sm font-medium border border-rose-100 dark:border-rose-900/50 animate-pulse" role="alert">
            🚨 {validationError}
          </div>
        )}

        {/* Subjects Table Wrapper */}
        <div className="overflow-x-auto rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10">
          <table className="w-full text-left border-collapse" aria-label="Academic Grade Calculation Sheet">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th scope="col" className="px-5 py-4 w-1/3">Subject Name</th>
                <th scope="col" className="px-5 py-4 text-center">Marks (0-100)</th>
                <th scope="col" className="px-5 py-4 text-center">Credits (1-6)</th>
                <th scope="col" className="px-5 py-4 text-center w-24">Grade</th>
                <th scope="col" className="px-5 py-4 text-center w-24">Grade Point</th>
              </tr>
            </thead>
            <tbody id="subjects-tbody" className="divide-y divide-slate-100 dark:divide-slate-800">
              {subjects.map((sub, index) => {
                // Live calculate for immediate row-level feedback if any data exists
                const rowGrade = sub.marks !== '' ? sub.grade || calculateGrade(sub.marks) : '';
                const rowGP = sub.marks !== '' ? sub.gradePoint ?? calculateGradePoint(rowGrade) : '';

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 bg-white dark:bg-slate-900 transition-colors">
                    {/* Subject Name Input */}
                    <td className="px-5 py-3.5">
                      <input
                        id={`subject-name-${index}`}
                        type="text"
                        value={sub.name}
                        onChange={(e) => updateSubjectField(index, 'name', e.target.value)}
                        placeholder={`Subject ${index + 1}`}
                        className="w-full bg-slate-50/30 hover:bg-slate-100/30 focus:bg-white dark:bg-slate-950/30 dark:hover:bg-slate-950/60 dark:focus:bg-slate-950 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-white outline-none transition-all font-medium"
                        aria-label={`Name for Subject ${index + 1}`}
                      />
                    </td>
                    
                    {/* Marks Input */}
                    <td className="px-5 py-3.5 text-center">
                      <input
                        id={`subject-marks-${index}`}
                        type="number"
                        value={sub.marks}
                        onChange={(e) => updateSubjectField(index, 'marks', e.target.value)}
                        placeholder="0"
                        min="0"
                        max="100"
                        className="w-20 mx-auto text-center font-semibold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-2 py-1.5 text-sm outline-none shadow-sm transition-all text-slate-800 dark:text-white"
                        aria-label={`Marks for ${sub.name || `Subject ${index + 1}`}`}
                      />
                    </td>

                    {/* Credits Input */}
                    <td className="px-5 py-3.5 text-center">
                      <input
                        id={`subject-credits-${index}`}
                        type="number"
                        value={sub.credits}
                        onChange={(e) => updateSubjectField(index, 'credits', e.target.value)}
                        placeholder="4"
                        min="1"
                        max="10"
                        className="w-20 mx-auto text-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-2 py-1.5 text-sm outline-none shadow-sm transition-all text-slate-800 dark:text-white"
                        aria-label={`Credits for ${sub.name || `Subject ${index + 1}`}`}
                      />
                    </td>

                    {/* Letter Grade Display */}
                    <td className="px-5 py-3.5 text-center font-bold text-sm">
                      {rowGrade ? (
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold font-mono tracking-wider ${
                          rowGrade === 'A+' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                          rowGrade === 'A' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' :
                          rowGrade.startsWith('B') ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' :
                          rowGrade.startsWith('C') ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                          rowGrade === 'D' ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300' :
                          'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}>
                          {rowGrade}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">—</span>
                      )}
                    </td>

                    {/* Grade Points */}
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-sm text-slate-600 dark:text-slate-400">
                      {rowGrade ? rowGP : <span className="text-slate-300 dark:text-slate-700">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Row Operations & actions */}
        <div className="mt-5 flex flex-wrap gap-4 items-center justify-between">
          
          {/* Add / Remove Buttons */}
          <div className="flex items-center gap-2" role="group" aria-label="Row operations">
            <button
              id="add-row-btn"
              onClick={addRow}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
              title="Add a new subject row to calculation sheet"
            >
              <Plus className="h-4 w-4 text-indigo-500" />
              <span>Add Subject</span>
            </button>
            <button
              id="remove-row-btn"
              onClick={removeLastRow}
              disabled={subjects.length <= 1}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:disabled:bg-slate-900 disabled:opacity-40 disabled:pointer-events-none text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
              title="Remove the last listed subject row"
            >
              <Minus className="h-4 w-4 text-rose-500" />
              <span>Remove Last</span>
            </button>
          </div>

          {/* Reset / Clear */}
          <button
            id="clear-all-btn"
            onClick={clearAllFields}
            className="text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 text-sm font-semibold flex items-center gap-1 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/80 rounded-xl px-3 py-2 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
            title="Wipe current calculation scores"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Card</span>
          </button>
        </div>

        {/* Calculation Trigger Divider Area */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            
            {/* Main triggers and display */}
            <div className="md:col-span-4 flex flex-col gap-3">
              <button
                id="calculate-sgpa-btn"
                onClick={executeCalculation}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                aria-label="Process raw SGPA calculations based on marks and credits list"
              >
                <Sparkles className="h-5 w-5 fill-current animate-pulse" />
                <span>Calculate SGPA</span>
              </button>

              <button
                id="save-semester-btn"
                onClick={handleSave}
                className="w-full border border-teal-200 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 font-semibold px-6 py-3 rounded-2xl hover:bg-teal-100 dark:hover:bg-teal-950 mt-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
                disabled={subjects.every(s => s.marks === '')}
                aria-label="Lock and Save this calculated score card to your permanent dashboard history"
              >
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Saved Successfully!</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save to History</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Analytics Dashboard Indicator Block */}
            <div className="md:col-span-8 bg-slate-50/70 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                
                {/* Resulting SGPA Card */}
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block">Semester SGPA</span>
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 leading-none block mt-1">
                    {calcResult.hasCalculated ? truncateToDecimals(calcResult.sgpa, 4) : "—"}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block mt-1">
                    {calcResult.hasCalculated ? `2 decimal: ${truncateToDecimals(calcResult.sgpa, 2)}` : "Not Calculated Yet"}
                  </span>
                </div>

                {/* Weighted Percentage Card */}
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block">Equivalent %</span>
                  <span className="text-3xl font-black text-rose-600 dark:text-rose-400 leading-none block mt-1">
                    {calcResult.hasCalculated ? `${truncateToDecimals(cgpaToPercentage(calcResult.sgpa), 2)}%` : "—"}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block mt-1">
                    Formula: SGPA × 9.5
                  </span>
                </div>

                {/* Total Credits */}
                <div className="col-span-2 md:col-span-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-center">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block">Total Valid Credits</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">
                    {calcResult.hasCalculated ? calcResult.totalCredits : "—"}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block mt-0.5">
                    Across {calcResult.hasCalculated ? calcResult.activeCount : 0} Subjects
                  </span>
                </div>

              </div>

              {/* Spirited Feedback Panel based on scores */}
              <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 text-center md:text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Academic Standing Notes</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium italic">
                  "{feedback.text}"
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
