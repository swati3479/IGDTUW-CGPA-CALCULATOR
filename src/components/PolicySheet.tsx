/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IGDTUW_GRADES } from '../utils/gradeCalculation';
import { BookOpen, Award, CheckCircle2, HelpCircle } from 'lucide-react';

export default function PolicySheet() {
  return (
    <div className="space-y-6" id="policy-reference">
      
      {/* Grading Scale Table & Classifications */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Official Grade Table */}
        <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <BookOpen className="h-4.5 w-4.5 text-indigo-500" />
            IGDTUW Official Grading Map
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Official ranges used by the evaluation controller for B.Tech, MCA, M.Tech, and B.Arch programs.
          </p>

          <div className="overflow-hidden border border-slate-150 dark:border-slate-850 rounded-xl">
            <table className="w-full text-left text-xs" aria-label="IGDTUW Official Grading Scheme">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 font-bold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-150 dark:border-slate-800">
                  <th scope="col" className="px-4 py-3">Marks Range</th>
                  <th scope="col" className="px-4 py-3 text-center">Letter Grade</th>
                  <th scope="col" className="px-4 py-3 text-center">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {IGDTUW_GRADES.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 bg-white dark:bg-slate-900">
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                      {r.minMarks === 93 ? "93 – 100" :
                       r.minMarks === 0 ? "Under 45" :
                       `${r.minMarks} – ${r.maxMarks}`}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-xs ${
                        r.gradePoint === 10 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                        r.gradePoint === 9 ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' :
                        r.gradePoint >= 7 ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' :
                        r.gradePoint >= 5 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                        r.gradePoint === 4 ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300' :
                        'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}>
                        {r.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold font-mono text-slate-600 dark:text-slate-300">
                      {r.gradePoint}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Division Class Regulations */}
        <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <Award className="h-4.5 w-4.5 text-indigo-500" />
              University Division Standards
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Upon finishing your course at IGDTUW, degree classifications are designated based on aggregate CGPA metrics:
            </p>

            <ul className="space-y-3.5" aria-label="Degree classifications thresholds">
              <li className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong>First Division with Exemplary Performance:</strong> Granted to those securing a CGPA of <strong>8.50 and above</strong>, provided they complete the course standard duration with no background backlogs.
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <strong>First Division with Distinction:</strong> Granted to students with an aggregate CGPA of <strong>7.50 and above</strong> but under 8.50.
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <strong>First Division:</strong> Requires an aggregate cumulative CGPA of <strong>6.75 and above</strong> but below 7.50.
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Second Division:</strong> Assigned for CGPA scoring of <strong>5.00 and above</strong> but under 6.75. This is the minimum threshold required to qualify for degrees.
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 italic font-medium">
            * Note: These definitions are standard academic guidelines. Refer to your exact academic year handbook / Controller of Examinations (CoE) bulletins for revisions.
          </div>
        </div>

      </div>

      {/* SEO rich Search Engine FAQ Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-md font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
          <HelpCircle className="h-4.5 w-4.5 text-amber-500" />
          IGDTUW Academic Grading FAQs
        </h3>

        <div className="space-y-5" aria-label="Frequently Asked Questions about grading scheme">
          
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Q1: How is the SGPA calculated for a single semester?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              SGPA (Semester Grade Point Average) is calculated as a weighted average. Each subject's Grade Point earned is multiplied by its Credit value. The sum of these weighted points across all subjects is then divided by the total sum of Credits registered in that semester.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Q2: What is the difference between SGPA and CGPA?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              SGPA reflects your academic result for a single term or semester. CGPA (Cumulative Grade Point Average) represents your overall performance across all semesters combined. Like SGPA, CGPA is weighted by the credit count of individual semesters to assure academic precision.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Q3: What is the minimum grade point required to pass a course?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              According to official IGDTUW parameters, a student must secure at least 45 marks (Grade "D", 4 Grade Points) to pass a lecture/practical subject. Scores below 45 marks result in an "F" grade (Fail, 0 Grade Points), which must be cleared via supplementary examinations.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Q4: How do I convert my CGPA to Percentage at IGDTUW?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-450 mt-1.5 leading-relaxed">
              In accordance with university conversion rules, you simply multiply your CGPA by <strong>9.5</strong>. For check: a CGPA of 8.4 translates directly to 79.8% aggregate marks. There are no additional subtracted offsets in the primary IGDTUW conversion scheme.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
