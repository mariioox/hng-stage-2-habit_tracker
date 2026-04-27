import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import DashboardPage from "@/app/dashboard/page";
import "@testing-library/jest-dom";

// Mock AuthGuard to render children immediately without logic
vi.mock("@/components/auth/AuthGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("dashboard actions", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // This ensures the first render is the "Final" render, stopping the loop
    const mockSession = { userId: "u1", email: "test@hng.tech" };
    const mockHabits = [
      {
        id: "1",
        userId: "u1",
        name: "Drink Water",
        description: "Hydrate",
        completions: [],
        createdAt: new Date().toISOString(),
        frequency: "daily",
      },
    ];

    localStorage.setItem("habit-tracker-session", JSON.stringify(mockSession));
    localStorage.setItem("habit-tracker-habits", JSON.stringify(mockHabits));
  });

  afterEach(() => {
    cleanup(); // Force clear JSDOM memory between tests
  });

  it("deletes a habit only after explicit confirmation", async () => {
    render(<DashboardPage />);

    // Using findBy to wait for the useEffect/Loading state to clear
    const deleteBtn = await screen.findByTestId("habit-delete-drink-water");
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByTestId("confirm-delete-button");
    expect(confirmBtn).toBeInTheDocument();

    fireEvent.click(confirmBtn);

    expect(
      screen.queryByTestId("habit-card-drink-water"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("toggles completion and updates the streak display", async () => {
    render(<DashboardPage />);

    const toggleBtn = await screen.findByTestId("habit-complete-drink-water");
    const streakDisplay = screen.getByTestId("habit-streak-drink-water");

    const initialText = streakDisplay.textContent;
    fireEvent.click(toggleBtn);

    expect(streakDisplay.textContent).not.toBe(initialText);
  });

  it("persists session and habits after page reload", async () => {
    render(<DashboardPage />);

    expect(await screen.findByTestId("dashboard-page")).toBeInTheDocument();
    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();
  });
});
