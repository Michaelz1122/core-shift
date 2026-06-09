// Controlled XP Progression Table
// Defines the total XP required to REACH a specific level.
// E.g., Level 1 requires 0 XP. Level 2 requires 100 XP total.
// Level 3 requires 250 XP total (100 + 150).
const XP_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2 (+100)
  250,    // Level 3 (+150)
  475,    // Level 4 (+225)
  800,    // Level 5 (+325)
  1250,   // Level 6 (+450)
  1850,   // Level 7 (+600)
  2650,   // Level 8 (+800)
  3700,   // Level 9 (+1050)
  5000,   // Level 10 (+1300)
];

/**
 * Given a total XP amount, returns the current Level (1-indexed).
 */
export function getLevelForXp(totalXp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= XP_THRESHOLDS[i]) {
      return i + 1; // 1-indexed level
    }
  }
  return 1;
}

/**
 * Returns the XP required to reach the NEXT level.
 * E.g. If current level is 1, returns 100.
 */
export function getXpRequiredForLevel(level: number): number {
  if (level >= XP_THRESHOLDS.length) {
    // If they exceed the max defined level, just add 1500 per level infinitely.
    return XP_THRESHOLDS[XP_THRESHOLDS.length - 1] + (level - XP_THRESHOLDS.length + 1) * 1500;
  }
  return XP_THRESHOLDS[level];
}

/**
 * Returns the base XP of the current level to calculate progress bar percentages.
 */
export function getBaseXpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level > XP_THRESHOLDS.length) {
    return XP_THRESHOLDS[XP_THRESHOLDS.length - 1] + (level - XP_THRESHOLDS.length) * 1500;
  }
  return XP_THRESHOLDS[level - 1];
}
