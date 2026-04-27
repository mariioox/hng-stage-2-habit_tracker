import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { STORAGE_KEYS } from '@/lib/constants';
import { Habit } from '@/types/habit';

describe('Habit Persistence Logic', () => {
  // Create a helper for a valid habit object to keep tests clean
  const createMockHabit = (overrides = {}): Habit => ({
    id: '1',
    name: 'Test Habit',
    description: '',
    completions: [],
    userId: 'user-123',      
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    ...overrides
  });

  it('adds a date to completions if it does not exist', () => {
    const habit = createMockHabit({ completions: [] });
    const date = '2026-04-26';
    
    const result = toggleHabitCompletion(habit, date);
    
    expect(result.completions).toContain(date);
    expect(result.completions.length).toBe(1);
  });

  it('removes a date from completions if it already exists', () => {
    const date = '2026-04-26';
    const habit = createMockHabit({ completions: [date] });
    
    const result = toggleHabitCompletion(habit, date);
    
    expect(result.completions).not.toContain(date);
    expect(result.completions.length).toBe(0);
  });
});

describe('Storage Constants', () => {
  it('defines the required local storage keys', () => {
    expect(STORAGE_KEYS.HABITS).toBeDefined();
    expect(typeof STORAGE_KEYS.HABITS).toBe('string');
  });
});