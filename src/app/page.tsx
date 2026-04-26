import Link from "next/link";

export default function Home() {
  return (
    <main className="auth-container">
      <div className="auth-form" style={{ textAlign: "center" }}>
        <h1 className="auth-title">Habit Tracker</h1>
        <p style={{ marginBottom: "2rem", color: "#666" }}>
          Master your routines. Build your streaks.
        </p>
        <Link
          href="/signup"
          className="auth-button"
          style={{ display: "block", textDecoration: "none" }}
        >
          Get Started... what does that mean, why do i have to think about it
          and how do i fix it?
        </Link>
        <Link
          href="/login"
          style={{ display: "block", marginTop: "1rem", color: "#6366f1" }}
        >
          Already have an account? Login
        </Link>
      </div>
    </main>
  );
}
