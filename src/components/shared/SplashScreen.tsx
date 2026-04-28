// src/components/shared/SplashScreen.tsx
"use client";

import React from "react";

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#ffffff",
        color: "#cf423a", // Using your brand red
      }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Habit Tracker</h1>
      <p style={{ marginTop: "1rem", color: "#666" }}>
        Stay consistent, stay lit.
      </p>
    </div>
  );
}
