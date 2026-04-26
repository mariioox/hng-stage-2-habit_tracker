"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthCredentials } from "@/types/auth";
import "@/styles/auth.css";

export default function SignupPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = (credentials: AuthCredentials) => {
    try {
      // Per technical requirement: Persistence must remain local
      localStorage.setItem("habit_user", JSON.stringify(credentials));
      router.push("/login");
    } catch (err) {
      console.log("Error saving user details:", err);
      setError("Failed to save account details.");
    }
  };

  return <AuthForm mode="signup" onSubmit={handleSignup} error={error} />;
}
