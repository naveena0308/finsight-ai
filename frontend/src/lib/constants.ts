export const SUGGESTED_PROMPTS = [
  {
    title: "Debt Trajectory",
    question: "What was Tamil Nadu's outstanding debt in 2024-25 and 2025-26, and what percent of GSDP was it?",
    category: "Numbers",
  },
  {
    title: "Revenue Deficit",
    question: "Why did the revenue deficit surge post-COVID and what caused it to become structural?",
    category: "Policy",
  },
  {
    title: "Committed Expenditure",
    question: "What is the share of committed expenditure (salaries, pensions, interest) in Tamil Nadu's budget?",
    category: "Breakdown",
  },
  {
    title: "Peer State Comparison",
    question: "How does Tamil Nadu's Debt-to-GSDP and interest burden compare to other peer states?",
    category: "Comparison",
  },
];

// Table 2.1: Outstanding Debt and Liabilities (Page 27)
export const DEBT_TRAJECTORY_DATA = [
  { year: "2020-21", debt: 512555, gsdpRatio: 28.7, growth: 21.0 },
  { year: "2021-22", debt: 596331, gsdpRatio: 28.8, growth: 16.3 },
  { year: "2022-23", debt: 677255, gsdpRatio: 28.5, growth: 13.6 },
  { year: "2023-24", debt: 758086, gsdpRatio: 28.2, growth: 11.9 },
  { year: "2024-25", debt: 853766, gsdpRatio: 27.4, growth: 12.6 },
  { year: "2025-26 (Pre-AC)", debt: 999832, gsdpRatio: 28.3, growth: 17.1 },
];

// Table 3.1: Revenue Deficit — 2020-21 to 2025-26 Pre AC (Page 44)
export const REVENUE_DEFICIT_DATA = [
  { year: "2020-21", deficit: 62326, gsdpRatio: 3.49, status: "COVID Peak" },
  { year: "2021-22", deficit: 46538, gsdpRatio: 2.25, status: "Post-COVID Deficit" },
  { year: "2022-23", deficit: 36215, gsdpRatio: 1.53, status: "Stabilizing Deficit" },
  { year: "2023-24", deficit: 45121, gsdpRatio: 1.68, status: "Persistent Deficit" },
  { year: "2024-25", deficit: 45840, gsdpRatio: 1.47, status: "Structural Deficit" },
  { year: "2025-26 (Pre-AC)", deficit: 54100, gsdpRatio: 1.53, status: "Projected Deficit" },
];

// Table 5.1: Composition of Committed Expenditure (CE) (Page 63) - Amounts in ₹ Thousand Crore
export const COMMITTED_EXPENDITURE_DATA = [
  { year: "2021-22", salaries: 60630, pensions: 23190, interest: 41560, totalCE: 125370, ceShare: 60.4 },
  { year: "2022-23", salaries: 68590, pensions: 28470, interest: 46910, totalCE: 143970, ceShare: 59.1 },
  { year: "2023-24", salaries: 75030, pensions: 33550, interest: 53570, totalCE: 162150, ceShare: 61.3 },
  { year: "2024-25", salaries: 78390, pensions: 36190, interest: 59910, totalCE: 174490, ceShare: 61.7 },
  { year: "2025-26 (Pre-AC)", salaries: 83320, pensions: 38740, interest: 67050, totalCE: 189110, ceShare: 64.4 },
];

// Table 2.2: Outstanding Liabilities of Major States (Page 28) - 2025-26 Projection
export const PEER_STATE_COMPARISON_DATA = [
  { state: "Maharashtra", debt: 1003027, gsdpRatio: 18.2, perCapitaDebt: 79500 },
  { state: "Tamil Nadu", debt: 999832, gsdpRatio: 28.3, perCapitaDebt: 126455 },
  { state: "Karnataka", debt: 768062, gsdpRatio: 21.5, perCapitaDebt: 112000 },
  { state: "Gujarat", debt: 524514, gsdpRatio: 15.8, perCapitaDebt: 74200 },
];
