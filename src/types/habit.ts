export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  createdAt: string;
  completions: string[]; // Must be YYYY-MM-DD strings
};

// This helps us when creating a new habit
export type CreateHabitInput = Pick<Habit, "name" | "description" >;