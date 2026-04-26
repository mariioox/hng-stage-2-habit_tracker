"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthFormProps, AuthCredentials } from "@/types/auth";

export const AuthForm = ({ mode, onSubmit, error }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const credentials: AuthCredentials = { email, password };
    onSubmit(credentials);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          {mode === "login" ? "Login to Habit Tracker" : "Create your account"}
        </h1>

        {error && (
          <div data-testid="auth-error-message" className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              data-testid="auth-login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              data-testid="auth-login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            data-testid="auth-login-submit"
          >
            {mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="auth-link-text">
          {mode === "login" ? (
            <>
              Don&apos;t have an account? <Link href="/signup">Sign up</Link>
            </>
          ) : (
            <>
              Already have an account? <Link href="/login">Login</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
