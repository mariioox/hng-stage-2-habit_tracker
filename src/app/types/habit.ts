export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  // We store completed dates as an array of ISO strings (YYYY-MM-DD)
  completedDates: string[]; 
  currentStreak: number;
}