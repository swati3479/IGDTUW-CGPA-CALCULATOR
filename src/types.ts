/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Subject {
  id: string;
  name: string;
  marks: string | number; // String to support easy clearing of inputs
  credits: string | number;
  gradePoint?: number;
  grade?: string;
}

export interface Semester {
  id: string;
  name: string;
  subjects: Subject[];
  sgpa: number;
  totalCredits: number;
}

export interface IGDTUWGradeRule {
  minMarks: number;
  maxMarks: number;
  grade: string;
  gradePoint: number;
}
