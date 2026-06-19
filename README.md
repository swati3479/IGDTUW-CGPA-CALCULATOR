# 🎓 IGDTUW CGPA & SGPA Calculator

An elegant, highly accurate, and responsive academic companion application designed customized for students of **Indira Gandhi Delhi Technical University for Women (IGDTUW)**.

This calculator simplifies academic planning, grade conversions, and performance forecasting while strictly adhering to the official grading schemas and multipliers regulated by the university.

---

## ✨ Core Features

### 📐 Double-Sided Grade Engine
*   **Precise CGPA to Percentage Conversion**: Supports the official IGDTUW formula (**Percentage = CGPA × 9.5**) for perfect accuracy when applying for placement drives, CAT, or higher studies.
*   **Dynamic SGPA Calculator**: Convert individual semester subjects, credits, and grades into a precise Semester Grade Point Average.
*   **Real-time Output**: Responsive visuals that compute grades as you type, rounding off with high-precision decimal truncation.

### 📊 Academic Statistics & Progress Tracker
*   **Semester-Wise Historical Tracking**: Add multiple years and semesters to see comprehensive historical performance trends.
*   **Dynamic Custom Charts**: Integrated interactive D3/Recharts modules visualizing your CGPA trajectory and semester credit distributions.
*   **Bento-Style Dashboard Cards**:
    *   **Peak Performance**: Highlights your highest semester SGPA.
    *   **Total Credits Completed**: Monitors aggregate weight over time.
    *   **Target Marks Focus**: Computes target requirements for maintaining university grades.

### 📚 Integrated Official Resources
*   **Interactive Policy Sheet**: A direct, responsive guide summarizing IGDTUW passing criteria (minimum 45% / Grade D to pass), supplementary rules, and grading point scales.
*   **Direct Scheme & Syllabus Portal**: Instantly view and download the official syllabi for all engineering and technical branches of IGDTUW.

---

## 🧭 Academic Formulas Decoded

### 1. Cumulative Grade Point Average (CGPA)
The SGPA is calculated using a credit-weighted system:

$$\text{SGPA} = \frac{\sum (\text{Subject Credits} \times \text{Grade Points Got})}{\sum \text{Subject Credits}}$$

For cumulative performance across multiple semesters, the CGPA is calculated as:

$$\text{CGPA} = \frac{\sum (\text{SGPA}_i \times \text{Semester Credits}_i)}{\sum \text{Semester Credits}_i}$$

### 2. Official Multiplier Change
*   **Formula**: $\text{Percentage} = \text{CGPA} \times 9.5$
*   *Note*: This standard 9.5 multiplier replaces old flat multiplication to align cleanly with AICTE, UPSC, and CAT admissions criteria.

---

## 🛠️ Technology Stack
*   **Language**: TypeScript + React 18
*   **Styling**: Tailwind CSS (with clean dark/light UI support)
*   **Animations**: Frictionless page and modal transitions using `motion`
*   **Charts**: Precision data visualizations via `recharts` / SVG modules
*   **Iconography**: Smooth and balanced icons powered by `lucide-react`
