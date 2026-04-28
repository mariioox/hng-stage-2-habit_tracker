"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { STORAGE_KEYS } from "@/lib/constants";
import { User, Session, AuthCredentials } from "@/types/auth";

export default function SignupPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = (credentials: AuthCredentials) => {
    const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];

    // Duplicate email signup must be rejected
    if (users.find((u) => u.email === credentials.email)) {
      setError("User already exists");
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: credentials.email,
      password: credentials.password,
      createdAt: new Date().toISOString(),
    };

    // Save user and session to local storage
    const updatedUsers = [...users, newUser];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

    const session: Session = { userId: newUser.id, email: newUser.email };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));

    router.push("/dashboard");
  };

  return <AuthForm mode="signup" onSubmit={handleSignup} error={error} />;
}
