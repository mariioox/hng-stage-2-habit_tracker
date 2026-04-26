export interface Habit {
  id: string;
  name: string;
  createdAt: string;    // ISO date string
  /** * completedDates: an array of strings in "YYYY-MM-DD" format.
   * This is better than a full ISO string because it makes 
   * checking "is this habit done today?" much easier.
   */
  completedDates: string[]; 
  currentStreak: number;
}

// This helps us when creating a new habit
export type CreateHabitInput = Pick<Habit, "name">;