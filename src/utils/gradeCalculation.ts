/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, IGDTUWGradeRule } from '../types';

export const IGDTUW_GRADES: IGDTUWGradeRule[] = [
  { minMarks: 93, maxMarks: 100, grade: 'A+', gradePoint: 10 },
  { minMarks: 85, maxMarks: 92, grade: 'A', gradePoint: 9 },
  { minMarks: 77, maxMarks: 84, grade: 'B+', gradePoint: 8 },
  { minMarks: 69, maxMarks: 76, grade: 'B', gradePoint: 7 },
  { minMarks: 61, maxMarks: 68, grade: 'C+', gradePoint: 6 },
  { minMarks: 53, maxMarks: 60, grade: 'C', gradePoint: 5 },
  { minMarks: 45, maxMarks: 52, grade: 'D', gradePoint: 4 },
  { minMarks: 0, maxMarks: 44, grade: 'F', gradePoint: 0 },
];

/**
 * Calculates grade based on marks according to IGDTUW guidelines
 */
export function calculateGrade(marks: number | string): string {
  const numericMarks = typeof marks === 'string' ? parseFloat(marks) : marks;
  if (isNaN(numericMarks) || numericMarks === null || numericMarks < 0) return '';
  
  if (numericMarks >= 93 && numericMarks <= 100) return 'A+';
  if (numericMarks >= 85 && numericMarks < 93) return 'A';
  if (numericMarks >= 77 && numericMarks < 85) return 'B+';
  if (numericMarks >= 69 && numericMarks < 77) return 'B';
  if (numericMarks >= 61 && numericMarks < 69) return 'C+';
  if (numericMarks >= 53 && numericMarks < 61) return 'C';
  if (numericMarks >= 45 && numericMarks < 53) return 'D';
  if (numericMarks < 45) return 'F';
  return '';
}

/**
 * Calculates Grade Point based on Grade letter
 */
export function calculateGradePoint(grade: string): number {
  switch (grade) {
    case 'A+': return 10;
    case 'A': return 9;
    case 'B+': return 8;
    case 'B': return 7;
    case 'C+': return 6;
    case 'C': return 5;
    case 'D': return 4;
    case 'F': return 0;
    default: return 0;
  }
}

/**
 * Calculates current SGPA and total credits from a list of subjects
 * Displays both raw precise values and rounded metrics
 */
export function calculateSubjectMetrics(subjects: Subject[]) {
  let totalCredits = 0;
  let weightedGradePoints = 0;
  let activeSubjectsCount = 0;

  const calculatedSubjects = subjects.map((sub) => {
    const marksVal = typeof sub.marks === 'string' ? parseFloat(sub.marks) : sub.marks;
    const creditsVal = typeof sub.credits === 'string' ? parseFloat(sub.credits) : sub.credits;

    if (isNaN(marksVal) || isNaN(creditsVal) || marksVal < 0 || creditsVal <= 0) {
      return { ...sub, gradePoint: undefined, grade: undefined };
    }

    const grade = calculateGrade(marksVal);
    const gradePoint = calculateGradePoint(grade);

    weightedGradePoints += gradePoint * creditsVal;
    totalCredits += creditsVal;
    activeSubjectsCount++;

    return {
      ...sub,
      grade,
      gradePoint,
    };
  });

  const rawSgpa = totalCredits > 0 ? weightedGradePoints / totalCredits : 0;

  return {
    calculatedSubjects,
    sgpa: rawSgpa,
    totalCredits,
    activeSubjectsCount,
  };
}

/**
 * Convert CGPA to equivalent percentage according to official IGDTUW standard (CGPA * 9.5)
 */
export function cgpaToPercentage(cgpa: number): number {
  if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) return 0;
  return cgpa * 9.5;
}

/**
 * Truncate a number to a specified number of decimal places without rounding.
 * E.g., truncateToDecimals(8.61892, 2) -> "8.61"
 * E.g., truncateToDecimals(8.61892, 4) -> "8.6189"
 */
export function truncateToDecimals(num: number, decimals: number): string {
  if (isNaN(num) || num === null || num === undefined) {
    if (decimals === 0) return "0";
    return "0." + "0".repeat(decimals);
  }

  // Handle scientific notation safely or floating point noise
  const numStr = Number(num).toString();
  const dotIndex = numStr.indexOf('.');

  if (dotIndex === -1) {
    if (decimals === 0) return numStr;
    return numStr + '.' + '0'.repeat(decimals);
  }

  const integerPart = numStr.substring(0, dotIndex);
  const decimalPart = numStr.substring(dotIndex + 1);

  if (decimals === 0) {
    return integerPart;
  }

  const truncatedDecimals = decimalPart.substring(0, decimals).padEnd(decimals, '0');
  return `${integerPart}.${truncatedDecimals}`;
}

/**
 * Returns supportive/academic advice based on the CGPA/SGPA ranges
 */
export function getSpiritedFeedback(score: number): { text: string; flavor: string } {
  if (score >= 9.5) {
    return { text: "Outstanding performance! You are paving the way to excellence.", flavor: "stellar" };
  } else if (score >= 8.5) {
    return { text: "Superb results! Your hard work is truly shining bright.", flavor: "excellent" };
  } else if (score >= 7.5) {
    return { text: "Great achievement! You have a solid grasp and a strong academic standing.", flavor: "very-good" };
  } else if (score >= 6.5) {
    return { text: "Good job! Consistent focus will take you even higher on upcoming benchmarks.", flavor: "good" };
  } else if (score >= 5.0) {
    return { text: "You've successfully cleared this milestone. Keep pushing your limits!", flavor: "average" };
  } else if (score > 0) {
    return { text: "Every step is an opportunity to learn and grow. You can boost this dynamically!", flavor: "improving" };
  }
  return { text: "Enter your subject marks and academic credit values to calculate statistics.", flavor: "neutral" };
}
