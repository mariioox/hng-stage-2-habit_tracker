import { describe, it, expect } from 'vitest';
import { getHabitSlug } from '@/lib/slug';

describe('getHabitSlug', () => {
  it('converts names to lowercase-hyphenated strings', () => {
    expect(getHabitSlug('Drink Water')).toBe('drink-water');
  });

  it('removes special characters and emojis', () => {
    expect(getHabitSlug('Gym! 💪')).toBe('gym');
  });

  it('collapses multiple spaces into a single hyphen', () => {
    expect(getHabitSlug('Run    Fast')).toBe('run-fast');
  });
});