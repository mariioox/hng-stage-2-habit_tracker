"use client";

import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import "@/styles/dashboard.css";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <AuthGuard>
      <div className="dashboard-container">
        <header className="header">
          <div>
            <h1>Dashboard</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
              Welcome back! Track your progress.
            </p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Sign Out
          </button>
        </header>

        <main className="habit-grid">
          {/* New Habit Trigger */}
          <div
            className="habit-card"
            style={{
              borderStyle: "dashed",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "1.5rem", color: "var(--primary-red)" }}>
              +
            </span>
            <span style={{ fontWeight: "600" }}>New Habit</span>
          </div>

          {/* Habit Item */}
          <div className="habit-card">
            <h3 className="habit-name">Morning Meditation</h3>
            <div className="streak-info">
              <span>🔥</span>
              <span>4 Day Streak</span>
            </div>
            <button className="complete-btn">Complete for Today</button>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
