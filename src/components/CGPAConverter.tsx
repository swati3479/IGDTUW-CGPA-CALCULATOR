/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { cgpaToPercentage, truncateToDecimals } from '../utils/gradeCalculation';
import { Percent, Copy, Check, Info, ArrowRight, Award } from 'lucide-react';

export default function CGPAConverter() {
  const [cgpa, setCgpa] = useState<number>(8.5);
  const [inputValue, setInputValue] = useState<string>('8.50');
  const [copied, setCopied] = useState(false);

  const percentage = cgpaToPercentage(cgpa);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setCgpa(val);
      setInputValue(truncateToDecimals(val, 2));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawStr = e.target.value;
    setInputValue(rawStr);

    const val = parseFloat(rawStr);
    if (!isNaN(val) && val >= 0 && val <= 10) {
      setCgpa(val);
    }
  };

  const handleInputBlur = () => {
    // Standardize input value on blur
    let val = parseFloat(inputValue);
    if (isNaN(val) || val < 0) {
      val = 0;
    } else if (val > 10) {
      val = 10;
    }
    setCgpa(val);
    setInputValue(truncateToDecimals(val, 2));
  };

  const copyToClipboard = () => {
    const textToCopy = `CGPA: ${truncateToDecimals(cgpa, 2)} | Percentage: ${truncateToDecimals(percentage, 2)}% (Calculated via IGDTUW Grading guidelines)`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  // Class/Division calculation according to standard Delhi Technical Universities
  const getDivision = (gpa: number) => {
    if (gpa >= 8.5) return { name: "First Division with Exemplary Performance", color: "text-emerald-600 dark:text-emerald-400" };
    if (gpa >= 7.5) return { name: "First Division with Distinction", color: "text-indigo-600 dark:text-indigo-400" };
    if (gpa >= 6.75) return { name: "First Division", color: "text-indigo-600 dark:text-indigo-400" };
    if (gpa >= 5.0) return { name: "Second Division", color: "text-orange-600 dark:text-orange-400" };
    if (gpa >= 4.0) return { name: "Pass Division", color: "text-slate-600 dark:text-slate-400" };
    return { name: "Fail / Academic Probation", color: "text-rose-600 dark:text-rose-400" };
  };

  const division = getDivision(cgpa);

  return (
    <div id="converter-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      
      {/* Title block */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <h2 id="converter-title" className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">💡</span>
          IGDTUW CGPA-to-Percentage Converter
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Instantly convert your Cumulative Grade Point Average to its equivalent percentage using the official university formula.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-center">
        
        {/* Input sliders & text */}
        <div className="md:col-span-6 space-y-6">
          
          {/* Custom CGPA Input Widget */}
          <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/80 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="cgpa-digit-input" className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Enter your CGPA
              </label>
              <div className="relative">
                <input
                  id="cgpa-digit-input"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="w-24 text-right pr-3 pl-2 py-2 text-xl font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono text-slate-800 dark:text-white outline-none transition-all"
                  aria-label="Numerical CGPA input between 0 and 10"
                />
              </div>
            </div>

            {/* Tactile Slider component */}
            <div className="mt-4">
              <input
                id="cgpa-slider"
                type="range"
                min="0.00"
                max="10.00"
                step="0.05"
                value={cgpa}
                onChange={handleSliderChange}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all [&::-webkit-slider-thumb]:w-4.5 [&::-webkit-slider-thumb]:h-4.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:appearance-none"
                aria-label="Drag to adjust CGPA visually"
              />
              <div className="flex justify-between text-[11px] font-bold font-mono text-slate-450 dark:text-slate-500 mt-2 uppercase">
                <span>0.0 GPA</span>
                <span>5.0</span>
                <span>7.5 Distinction</span>
                <span>10.0 Peak</span>
              </div>
            </div>
          </div>

          {/* Division Class Tag */}
          <div className="p-4.5 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-slate-950/10 flex items-start gap-3">
            <Award className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Estimated University Rank Class</p>
              <p className={`text-md font-extrabold mt-1 tracking-tight ${division.color}`}>
                {division.name}
              </p>
            </div>
          </div>

        </div>

        {/* Big Output gauge */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          
          {/* Conversion Output Bubble */}
          <div className="w-56 h-56 rounded-full border-4 border-dashed border-indigo-500/20 dark:border-indigo-400/20 flex flex-col items-center justify-center shadow-lg bg-slate-50/40 dark:bg-slate-950/40 transition-all relative">
            
            <div className="absolute inset-2 border border-slate-200 dark:border-slate-800 rounded-full bg-white dark:bg-slate-900 shadow-inner flex flex-col items-center justify-center p-4">
              <Percent className="h-7 w-7 text-indigo-500 mb-0.5" />
              <span className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none block">
                {truncateToDecimals(percentage, 2)}%
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold tracking-widest uppercase mt-2.5">
                EQUIVALENT PERCENTAGE
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block mt-1">
                CGPA × 9.5 Formula
              </span>
            </div>

          </div>

          <button
            id="copy-convert-btn"
            onClick={copyToClipboard}
            className="mt-6 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 shadow-sm hover:-translate-y-0.5"
            aria-label="Copy conversion result to system clipboard"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500 stroke-[3]" />
                <span>Copied summary!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Summary for Resume</span>
              </>
            )}
          </button>

        </div>

      </div>

      {/* Converter FAQ Footer */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/10 p-4.5 rounded-xl border border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Info className="h-4 w-4 text-blue-500" /> Convertor Reference Insights
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
          Indira Gandhi Delhi Technical University for Women (IGDTUW) official percentage evaluation is designed to map simple aggregate scaling where <strong>Percentage = Cumulative Grade Point Average (CGPA) × 9.5</strong>. This simple multiplier is standard in major companies, technical screening rounds, UPSC standards, and CAT / MBA college shortlisting grids.
        </p>
      </div>

    </div>
  );
}
