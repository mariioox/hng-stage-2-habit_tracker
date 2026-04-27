import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HabitModal } from "@/components/dashboard/HabitModal";
import "@testing-library/jest-dom";

describe("HabitModal Integration", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    mode: "create" as const,
  };

  it("calls onSave with trimmed values when form is valid", () => {
    render(<HabitModal {...defaultProps} />);

    const nameInput = screen.getByTestId("habit-form-name");
    const submitButton = screen.getByTestId("habit-form-submit");

    // Type with extra spaces to test trimming requirement
    fireEvent.change(nameInput, { target: { value: "  Meditation  " } });
    fireEvent.click(submitButton);

    expect(defaultProps.onSave).toHaveBeenCalledWith("Meditation", "");
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("displays error message when habit name is empty", () => {
    render(<HabitModal {...defaultProps} />);

    const submitButton = screen.getByTestId("habit-form-submit");
    fireEvent.click(submitButton);

    // Requirement: Check for exact error string and test-id
    const errorMessage = screen.getByTestId("habit-error-message");
    expect(errorMessage).toHaveTextContent("Habit name is required");
  });

  it("clears error message when user starts typing", () => {
    render(<HabitModal {...defaultProps} />);

    const nameInput = screen.getByTestId("habit-form-name");
    const submitButton = screen.getByTestId("habit-form-submit");

    // Trigger error
    fireEvent.click(submitButton);
    expect(screen.getByTestId("habit-error-message")).toBeInTheDocument();

    // Type something
    fireEvent.change(nameInput, { target: { value: "A" } });

    // Error should disappear
    expect(screen.queryByTestId("habit-error-message")).not.toBeInTheDocument();
  });
});
