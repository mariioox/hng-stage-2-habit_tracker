import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */ 

describe('calculateCurrentStreak', () => {
  const today = '2026-04-26'; // Baseline

  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], today)).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    // Yesterday was done, but today isn't
    expect(calculateCurrentStreak(['2026-04-25'], today)).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    const data = [today, '2026-04-25', '2026-04-24'];
    expect(calculateCurrentStreak(data, today)).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    const data = [today, today, '2026-04-25'];
    expect(calculateCurrentStreak(data, today)).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    const data = [today, '2026-04-24']; // Gap on the 25th
    expect(calculateCurrentStreak(data, today)).toBe(1);
  });
  it('uses the system date if no date is provided', () => {
    const todayStr = new Date().toISOString().split('T')[0];
    // We expect 1 if we completed today (system time)
    expect(calculateCurrentStreak([todayStr])).toBe(1);
  });
});