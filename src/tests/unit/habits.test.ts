import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';

describe('toggleHabitCompletion', () => {
  const mockHabit: Habit = {
    id: '1',
    name: 'Test',
    description: '',
    completions: [],
    userId: 'u1',
    frequency: 'daily',
    createdAt: new Date().toISOString()
  };

  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(mockHabit, '2026-04-26');
    expect(result.completions).toContain('2026-04-26');
  });

  it('removes a completion date when the date already exists', () => {
    const habitWithDate = { ...mockHabit, completions: ['2026-04-26'] };
    const result = toggleHabitCompletion(habitWithDate, '2026-04-26');
    expect(result.completions).not.toContain('2026-04-26');
  });

  it('does not mutate the original habit object', () => {
    const originalCompletions = [...mockHabit.completions];
    toggleHabitCompletion(mockHabit, '2026-04-26');
    expect(mockHabit.completions).toEqual(originalCompletions);
  });

  it('does not return duplicate completion dates', () => {
    // This is handled by our Set logic in the function
    const habit = { ...mockHabit, completions: ['2026-04-26'] };
    const result = toggleHabitCompletion(habit, '2026-04-26'); // Removes it
    const final = toggleHabitCompletion(result, '2026-04-26'); // Adds it back
    expect(new Set(final.completions).size).toBe(final.completions.length);
  });
});