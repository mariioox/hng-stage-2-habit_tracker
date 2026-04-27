import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HabitModal } from "@/components/dashboard/HabitModal";
import "@testing-library/jest-dom";

describe("HabitForm", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    mode: "create" as const,
  };

  it("shows a validation error when habit name is empty", () => {
    render(<HabitModal {...defaultProps} />);
    const submitButton = screen.getByTestId("habit-form-submit");
    fireEvent.click(submitButton);

    const errorMessage = screen.getByTestId("habit-error-message");
    expect(errorMessage).toHaveTextContent("Habit name is required");
  });

  it("creates a new habit and renders it in the list", () => {
    render(<HabitModal {...defaultProps} />);
    const nameInput = screen.getByTestId("habit-form-name");
    const submitButton = screen.getByTestId("habit-form-submit");

    fireEvent.change(nameInput, { target: { value: "Drink Water" } });
    fireEvent.click(submitButton);

    expect(defaultProps.onSave).toHaveBeenCalledWith("Drink Water", "");
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("edits an existing habit and preserves immutable fields", () => {
    render(
      <HabitModal
        {...defaultProps}
        mode="edit"
        initialName="Old Name"
        initialDescription="Old Desc"
      />,
    );
    const nameInput = screen.getByTestId("habit-form-name");
    fireEvent.change(nameInput, { target: { value: "New Name" } });

    const submitButton = screen.getByTestId("habit-form-submit");
    fireEvent.click(submitButton);

    expect(defaultProps.onSave).toHaveBeenCalledWith("New Name", "Old Desc");
  });
});
