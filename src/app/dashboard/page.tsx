"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HabitModal } from "@/components/dashboard/HabitModal";
import { Habit } from "@/types/habit";
import AuthGuard from "@/components/auth/AuthGuard";
import "@/styles/dashboard.css";

export default function DashboardPage() {
  const router = useRouter(); // Initialize the router
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("habits");
    if (saved) setHabits(JSON.parse(saved));
  }, []);

  // Add the handleLogout function
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  const saveToLocal = (newHabits: Habit[]) => {
    setHabits(newHabits);
    localStorage.setItem("habits", JSON.stringify(newHabits));
  };

  const handleCreateOrUpdate = (name: string) => {
    if (editingHabit) {
      const updated = habits.map((h) =>
        h.id === editingHabit.id ? { ...h, name } : h,
      );
      saveToLocal(updated);
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        completedDates: [],
        currentStreak: 0,
      };
      saveToLocal([...habits, newHabit]);
    }
    setEditingHabit(null);
  };

  const deleteHabit = (id: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      const filtered = habits.filter((h) => h.id !== id);
      saveToLocal(filtered);
    }
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  return (
    <AuthGuard>
      <div className="dashboard-container">
        <header className="header">
          <div>
            <h1>Your Dashboard</h1>
            <p
              style={{
                color: "grey",
                marginTop: "4px",
                fontSize: "0.9rem",
              }}
            >
              Good to have you back! Look at how far you&apos;ve come.
            </p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Sign Out
          </button>
        </header>

        <main className="habit-grid">
          <div
            className="habit-card add-habit-card"
            onClick={() => {
              setEditingHabit(null);
              setIsModalOpen(true);
            }}
          >
            <span>+ New Habit</span>
          </div>

          {habits.map((habit) => (
            <div key={habit.id} className="habit-card">
              <div className="habit-card-header">
                <h3 className="habit-name">{habit.name}</h3>
                <div className="habit-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => openEditModal(habit)}
                  >
                    ✎
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => deleteHabit(habit.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="streak-info">
                🔥 {habit.currentStreak} Day Streak
              </div>
              <button className="complete-btn">Complete</button>
            </div>
          ))}
        </main>

        <HabitModal
          isOpen={isModalOpen}
          mode={editingHabit ? "edit" : "create"}
          initialValue={editingHabit?.name || ""}
          onClose={() => {
            setIsModalOpen(false);
            setEditingHabit(null);
          }}
          onSave={handleCreateOrUpdate}
        />
      </div>
    </AuthGuard>
  );
}
