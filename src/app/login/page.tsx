"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthCredentials } from "@/types/auth";
import "@/styles/auth.css";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (credentials: AuthCredentials) => {
    const storedUserRaw = localStorage.getItem("habit_user");

    if (!storedUserRaw) {
      setError("No user found. Please sign up first.");
      return;
    }

    const storedUser = JSON.parse(storedUserRaw);

    if (
      storedUser.email === credentials.email &&
      storedUser.password === credentials.password
    ) {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return <AuthForm mode="login" onSubmit={handleLogin} error={error} />;
}
