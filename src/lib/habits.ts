import { Habit } from "@/types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const isAlreadyCompleted = habit.completions.includes(date);

  const newCompletions = isAlreadyCompleted
    ? habit.completions.filter((d) => d !== date)
    : [...habit.completions, date];

  // Return a new object to ensure immutability
  return {
    ...habit,
    completions: Array.from(new Set(newCompletions)),
  };
}