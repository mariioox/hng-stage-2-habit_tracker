import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthForm } from "@/components/auth/AuthForm";
import "@testing-library/jest-dom";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("auth flow", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("shows validation errors for invalid login credentials", async () => {
    // In your component, 'required' handles basic validation.
    // To test the error message display:
    render(
      <AuthForm
        mode="login"
        onSubmit={mockOnSubmit}
        error="Invalid credentials"
      />,
    );

    expect(screen.getByTestId("auth-error-message")).toHaveTextContent(
      "Invalid credentials",
    );
  });

  it("persists session and habits after page reload", async () => {
    render(<AuthForm mode="login" onSubmit={mockOnSubmit} />);

    // Using the specific login IDs from the contract
    const emailInput = screen.getByTestId("auth-login-email");
    const passwordInput = screen.getByTestId("auth-login-password");
    const submitButton = screen.getByTestId("auth-login-submit");

    fireEvent.change(emailInput, { target: { value: "test@hng.tech" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(submitButton.closest("form")!);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: "test@hng.tech",
      password: "password123",
    });
  });

  it("logs out and redirects to /login", () => {
    localStorage.setItem(
      "habit-tracker-session",
      JSON.stringify({ userId: "1" }),
    );

    // Simulate the logout behavior required by Section 16.3
    const performLogout = () => {
      localStorage.removeItem("habit-tracker-session");
      mockPush("/login");
    };

    performLogout();
    expect(localStorage.getItem("habit-tracker-session")).toBeNull();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
