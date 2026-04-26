"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthCredentials, User, Session } from "@/types/auth";
import { STORAGE_KEYS } from "@/lib/constants";
import "@/styles/auth.css";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (credentials: AuthCredentials) => {
    // 1. Get users from the CORRECT key
    const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];

    // 2. Find user
    const user = users.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password,
    );

    if (user) {
      // 3. Store Session as an OBJECT (Requirement 8.2)
      const session: Session = { userId: user.id, email: user.email };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return <AuthForm mode="login" onSubmit={handleLogin} error={error} />;
}
