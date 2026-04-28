"use client";

import React, { useState, useEffect } from "react";
import { validateHabitName } from "@/lib/validators";
import "@/styles/modal.css";

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  initialName?: string;
  initialDescription?: string;
  mode: "create" | "edit";
}

export const HabitModal = ({
  isOpen,
  onClose,
  onSave,
  initialName = "",
  initialDescription = "",
  mode,
}: HabitModalProps) => {
  const [habitName, setHabitName] = useState(initialName);
  const [habitDescription, setHabitDescription] = useState(initialDescription);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHabitName(initialName);
      setHabitDescription(initialDescription);
      setError(null);
    }
  }, [isOpen, initialName, initialDescription]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = validateHabitName(habitName);
    if (!result.valid) {
      setError(result.error);
      return;
    }
    onSave(result.value, habitDescription.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="modal-header">
          <h2>{mode === "create" ? "New Habit" : "Edit Habit"}</h2>
          {error && (
            <div className="error-message" data-testid="habit-error-message">
              {error}
            </div>
          )}
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="habit-name-input">Habit Name</label>
            <input
              id="habit-name-input"
              value={habitName}
              onChange={(e) => {
                setHabitName(e.target.value);
                if (error) setError(null);
              }}
              data-testid="habit-form-name"
              placeholder="e.g. Exercise"
            />
          </div>

          <div className="form-group">
            <label htmlFor="habit-desc-input">Description (Optional)</label>
            <input
              id="habit-desc-input"
              value={habitDescription}
              onChange={(e) => setHabitDescription(e.target.value)}
              data-testid="habit-form-description"
              placeholder="Add details..."
            />
          </div>

          <div className="modal-actions">
            <button
              data-testid="habit-form-cancel"
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              data-testid="habit-form-submit"
              type="submit"
              className="btn-primary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
