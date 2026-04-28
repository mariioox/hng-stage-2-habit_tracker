// src/components/auth/AuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_KEYS } from "@/lib/constants";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "authorized" | "unauthorized"
  >("loading");

  useEffect(() => {
    console.log("AUTHGUARD: Starting check..."); // DEBUG LOG

    // Check storage immediately
    const sessionRaw = localStorage.getItem(STORAGE_KEYS.SESSION);
    console.log("AUTHGUARD: Session found?", !!sessionRaw); // DEBUG LOG

    if (sessionRaw) {
      setStatus("authorized");
    } else {
      setStatus("unauthorized");
      router.replace("/login");
    }
  }, [router]);

  // If you see "Loading..." but DON'T see the console logs above,
  // your JavaScript is not executing at all while offline.
  if (status === "loading") {
    return (
      <div data-testid="loading" style={{ padding: "5rem", color: "red" }}>
        Loading UI (Checking Auth)...
      </div>
    );
  }

  return <>{children}</>;
}
