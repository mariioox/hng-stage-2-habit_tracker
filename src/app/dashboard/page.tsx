"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { HabitModal } from "@/components/dashboard/HabitModal";
import { Habit } from "@/types/habit";
import "@/styles/dashboard.css";

export default function DashboardPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habits from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("habits");
    if (saved) setHabits(JSON.parse(saved));
  }, []);

  const handleSaveHabit = (name: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      completedDates: [],
      currentStreak: 0,
    };

    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    localStorage.setItem("habits", JSON.stringify(updatedHabits));
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <AuthGuard>
      <div className="dashboard-container">
        <header className="header">
          <h1>Habits</h1>
          <button onClick={handleLogout} className="logout-btn">
            Sign Out
          </button>
        </header>

        <main className="habit-grid">
          <div
            className="habit-card add-habit-card"
            onClick={() => setIsModalOpen(true)}
          >
            <span style={{ fontSize: "2rem" }}>+</span>
            <p>New Habit</p>
          </div>

          {habits.map((habit) => (
            <div key={habit.id} className="habit-card">
              <h3 className="habit-name">{habit.name}</h3>
              <div className="streak-info">
                <span>🔥</span>
                <span>{habit.currentStreak} Day Streak</span>
              </div>
              <button className="complete-btn">Complete</button>
            </div>
          ))}
        </main>

        <HabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveHabit}
        />
      </div>
    </AuthGuard>
  );
}
