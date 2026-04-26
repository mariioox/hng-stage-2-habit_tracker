/**
 * Calculates the current streak based on consecutive calendar days.
 * Rules:
 * - Remove duplicates and sort before logic [cite: 138-139]
 * - If today is not completed, streak is 0 [cite: 140]
 * - If today is completed, count backwards consecutively 
 */
export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayStr = today || new Date().toISOString().split('T')[0];

  if (completions.length === 0 || !completions.includes(todayStr)) {
    return 0; // Rule: today not completed => 0 [cite: 140, 143]
  }

  // Deduplicate and sort descending (newest to oldest) [cite: 138-139]
  const sortedDates = Array.from(new Set(completions)).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  let streak = 0;
  const currentCheckDate = new Date(todayStr);

  for (const dateStr of sortedDates) {
    const completionDate = new Date(dateStr);
    
    // Check if the completion date matches the day we are looking for
    if (completionDate.toISOString().split('T')[0] === currentCheckDate.toISOString().split('T')[0]) {
      streak++;
      // Move check date back exactly one day
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    } else {
      // Gap found, streak broken [cite: 141, 324]
      break;
    }
  }

  return streak;
}