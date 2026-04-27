"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_KEYS } from "@/lib/constants";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const sessionRaw = localStorage.getItem(STORAGE_KEYS.SESSION);

      if (sessionRaw) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      data-testid="splash-screen"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Habit Tracker</h1>
      <div className="spinner">⌛ Loading...</div>
    </div>
  );
}
