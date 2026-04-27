"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HabitModal } from "@/components/dashboard/HabitModal";
import { Habit } from "@/types/habit";
import { Session } from "@/types/auth";
import AuthGuard from "@/components/auth/AuthGuard";

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Track which habit is currently showing the confirm delete buttons
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null,
  );

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const sessionRaw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!sessionRaw) {
      router.push("/login");
      return;
    }
    const currentSession: Session = JSON.parse(sessionRaw);
    setSession(currentSession);

    const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (saved) {
      const allHabits: Habit[] = JSON.parse(saved);
      const userHabits = allHabits.filter(
        (h) => h.userId === currentSession.userId,
      );
      setHabits(userHabits);
    }
    setIsInitialLoad(false);
  }, [router]);

  if (isInitialLoad) return <div data-testid="loading">Loading...</div>;

  const saveToLocal = (newHabits: Habit[]) => {
    setHabits(newHabits);

    // Safety check: ensure we use the current session ID even if state is pending
    const userId = session?.userId;
    if (!userId) return;

    const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
    const allHabits: Habit[] = saved ? JSON.parse(saved) : [];

    const otherUsersHabits = allHabits.filter((h) => h.userId !== userId);

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
    setIsModalOpen(false);
  };

  const handleToggleComplete = (habit: Habit) => {
    const updatedHabit = toggleHabitCompletion(habit, todayStr);
    const updatedHabits = habits.map((h) =>
      h.id === habit.id ? updatedHabit : h,
    );
    saveToLocal(updatedHabits);
  };

  const deleteHabit = (id: string) => {
    const filtered = habits.filter((h) => h.id !== id);
    saveToLocal(filtered);
    setConfirmingDeleteId(null);
  };

  return (
    <AuthGuard>
      <div className="dashboard-container" data-testid="dashboard-page">
        <header className="header">
          <div>
            <h1>Dashboard</h1>
            <p
              style={{
                color: "var(--grey)",
                fontSize: "0.9rem",
                marginTop: "5px",
              }}
            >
              Logged in as {session?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="logout-btn"
            data-testid="auth-logout-button"
          >
            Sign Out
          </button>
        </header>

        <main className="habit-grid">
          {/* SECTION 10 CONTRACT: create-habit-button */}
          <div
            className="habit-card add-habit-card"
            data-testid="create-habit-button"
            onClick={() => {
              setEditingHabit(null);
              setIsModalOpen(true);
            }}
          >
            <span style={{ fontSize: "2rem" }}>+</span>
            <p>New Habit</p>
          </div>

          {/* SECTION 10 CONTRACT: empty-state rendering logic */}
          {habits.length === 0 ? (
            <div data-testid="empty-state" className="empty-state-container">
              <p>No habits yet. Start by creating one!</p>
            </div>
          ) : (
            habits.map((habit) => {
              const slug = getHabitSlug(habit.name);
              const isDoneToday = habit.completions.includes(todayStr);
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
                    <div className="habit-info-wrapper">
                      <h3 className="habit-name" data-testid="habit-card-name">
                        {habit.name}
                      </h3>
                      {habit.description && (
                        <p
                          className="habit-description"
                          data-testid="habit-card-description"
                        >
                          {habit.description}
                        </p>
                      )}
                    </div>

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

                      {confirmingDeleteId !== habit.id ? (
                        <button
                          className="action-btn"
                          data-testid={`habit-delete-${slug}`}
                          onClick={() => setConfirmingDeleteId(habit.id)}
                        >
                          🗑️
                        </button>
                      ) : (
                        <div className="confirm-actions">
                          <button
                            className="btn-danger-small"
                            data-testid="confirm-delete-button"
                            onClick={() => deleteHabit(habit.id)}
                          >
                            Confirm
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => setConfirmingDeleteId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="streak-info">
                    <span>🔥</span>
                    <span data-testid={`habit-streak-${slug}`}>
                      {currentStreak} Day Streak
                    </span>
                  </div>

                  <button
                    data-testid={`habit-complete-${slug}`}
                    className={`complete-btn ${isDoneToday ? "completed" : ""}`}
                    onClick={() => handleToggleComplete(habit)}
                  >
                    {isDoneToday ? "Completed" : "Mark as Done"}
                  </button>
                </div>
              );
            })
          )}
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
