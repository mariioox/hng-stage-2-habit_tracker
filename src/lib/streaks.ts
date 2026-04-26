/* Calculates the current streak based on consecutive calendar days. */
export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayStr = today || new Date().toISOString().split('T')[0];

  if (completions.length === 0 || !completions.includes(todayStr)) {
    return 0; // streak = 0 if today not completed
}

  // Deduplicate and sort descending (newest to oldest)
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
      // Gap found, streak broken
      break;
    }
  }

  return streak;
}