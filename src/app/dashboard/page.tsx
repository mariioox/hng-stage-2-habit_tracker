"use client";

import AuthGuard from "@/components/auth/AuthGuard";

export default function Dashboard() {
  return (
    <AuthGuard>
      <main style={{ padding: "2rem" }}>
        <h1>Habit Tracker Dashboard</h1>
        <p>If you can see this, you are logged in!</p>

        <button
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "/login";
          }}
          className="auth-button" // using your existing style
          style={{ width: "auto", marginTop: "1rem" }}
        >
          Logout
        </button>
      </main>
    </AuthGuard>
  );
}
