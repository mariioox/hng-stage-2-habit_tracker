import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import DashboardPage from "@/app/dashboard/page";
import "@testing-library/jest-dom";

// 1. Force the Guard to stay out of the way
vi.mock("@/components/auth/AuthGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// 2. Stable Router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("dashboard actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // 3. SEED DATA - Use the exact keys from your STORAGE_KEYS constant
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
    cleanup();
  });

  it("deletes a habit only after explicit confirmation", async () => {
    render(<DashboardPage />);

    // Wait for loading to finish and card to appear
    const deleteBtn = await screen.findByTestId("habit-delete-drink-water");
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByTestId("confirm-delete-button");
    expect(confirmBtn).toBeInTheDocument();

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(
        screen.queryByTestId("habit-card-drink-water"),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });
  });

  it("toggles completion and updates the streak display", async () => {
    render(<DashboardPage />);

    const toggleBtn = await screen.findByTestId("habit-complete-drink-water");
    const streakDisplay = screen.getByTestId("habit-streak-drink-water");

    const initialText = streakDisplay.textContent;
    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(streakDisplay.textContent).not.toBe(initialText);
    });
  });

  it("persists session and habits after page reload", async () => {
    render(<DashboardPage />);

    // Ensure the main container and seeded card are rendered
    expect(await screen.findByTestId("dashboard-page")).toBeInTheDocument();
    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();
  });
});
