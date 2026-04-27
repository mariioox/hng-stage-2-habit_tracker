import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */

describe('calculateCurrentStreak', () => {
  const today = '2026-04-26';

  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], today)).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
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
    const data = [today, '2026-04-24'];
    expect(calculateCurrentStreak(data, today)).toBe(1);
  });
});