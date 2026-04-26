"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HabitModal } from "@/components/dashboard/HabitModal";
import { Habit } from "@/types/habit";
import { Session } from "@/types/auth";
import AuthGuard from "@/components/auth/AuthGuard";

// REQUIREMENT: Use specific utility functions for logic
import { toggleHabitCompletion } from "@/lib/habits";
import { calculateCurrentStreak } from "@/lib/streaks";
import { STORAGE_KEYS } from "@/lib/constants";
import { getHabitSlug } from "@/lib/slug";

import "@/styles/dashboard.css";

export default function DashboardPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Get current date string for consistency
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // REQUIREMENT: Persist session from required key
    const sessionRaw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!sessionRaw) {
      router.push("/login");
      return;
    }
    const currentSession: Session = JSON.parse(sessionRaw);
    setSession(currentSession);

    // REQUIREMENT: Persist habits and filter by userId
    const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (saved) {
      const allHabits: Habit[] = JSON.parse(saved);
      const userHabits = allHabits.filter(
        (h) => h.userId === currentSession.userId,
      );
      setHabits(userHabits);
    }
  }, [router]);

  const saveToLocal = (newHabits: Habit[]) => {
    setHabits(newHabits);
    const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
    const allHabits: Habit[] = saved ? JSON.parse(saved) : [];

    // Maintain other users' data in local storage while updating current user
    const otherUsersHabits = allHabits.filter(
      (h) => h.userId !== session?.userId,
    );
    localStorage.setItem(
      STORAGE_KEYS.HABITS,
      JSON.stringify([...otherUsersHabits, ...newHabits]),
    );
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    router.push("/login");
  };

  const handleCreateOrUpdate = (name: string, description: string) => {
    if (!session) return;

    if (editingHabit) {
      const updated = habits.map((h) =>
        h.id === editingHabit.id ? { ...h, name, description } : h,
      );
      saveToLocal(updated);
    } else {
      // REQUIREMENT: Habit object must match the required contract
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: session.userId,
        name,
        description: description || "",
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      };
      saveToLocal([...habits, newHabit]);
    }
    setEditingHabit(null);
  };

  const handleToggleComplete = (habit: Habit) => {
    // REQUIREMENT: Use required toggle logic
    const updatedHabit = toggleHabitCompletion(habit, todayStr);
    const updatedHabits = habits.map((h) =>
      h.id === habit.id ? updatedHabit : h,
    );
    saveToLocal(updatedHabits);
  };

  const deleteHabit = (id: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      const filtered = habits.filter((h) => h.id !== id);
      saveToLocal(filtered);
    }
  };

  return (
    <AuthGuard>
      <div className="dashboard-container" data-testid="dashboard-page">
        <header className="header">
          <div>
            <h1>Dashboard</h1>
            <p style={{ color: "var(--grey)", fontSize: "0.9rem" }}>
              Logged in as {session?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="logout-btn"
            data-testid="nav-logout"
          >
            Sign Out
          </button>
        </header>

        <main className="habit-grid">
          {/* REQUIREMENT: Specific Test ID for Add Button */}
          <div
            className="habit-card add-habit-card"
            data-testid="habit-add-button"
            onClick={() => {
              setEditingHabit(null);
              setIsModalOpen(true);
            }}
          >
            <span style={{ fontSize: "2rem" }}>+</span>
            <p>New Habit</p>
          </div>

          {habits.map((habit) => {
            const slug = getHabitSlug(habit.name);
            const isDoneToday = habit.completions.includes(todayStr);

            // REQUIREMENT: Streak must be calculated dynamically
            const currentStreak = calculateCurrentStreak(
              habit.completions,
              todayStr,
            );

            return (
              <div
                key={habit.id}
                className="habit-card"
                data-testid={`habit-card-${slug}`}
              >
                <div className="habit-card-header">
                  <h3 className="habit-name" data-testid="habit-card-name">
                    {habit.name}
                  </h3>
                  <div className="habit-actions">
                    <button
                      className="action-btn"
                      data-testid={`habit-edit-${slug}`}
                      onClick={() => {
                        setEditingHabit(habit);
                        setIsModalOpen(true);
                      }}
                    >
                      ✎
                    </button>
                    <button
                      className="action-btn"
                      data-testid={`habit-delete-${slug}`}
                      onClick={() => deleteHabit(habit.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="streak-info">
                  <span>🔥</span>
                  {/* REQUIREMENT: Specific Test ID for count */}
                  <span data-testid="habit-streak-count">
                    {currentStreak} Day Streak
                  </span>
                </div>

                <button
                  data-testid={`habit-complete-button-${slug}`}
                  className={`complete-btn ${isDoneToday ? "completed" : ""}`}
                  onClick={() => handleToggleComplete(habit)}
                >
                  {isDoneToday ? "Completed" : "Mark as Done"}
                </button>
              </div>
            );
          })}
        </main>

        <HabitModal
          isOpen={isModalOpen}
          mode={editingHabit ? "edit" : "create"}
          initialName={editingHabit?.name || ""}
          initialDescription={editingHabit?.description || ""}
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
