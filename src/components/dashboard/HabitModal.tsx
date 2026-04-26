"use client";

import React, { useState } from "react";
import "@/styles/modal.css";

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const HabitModal = ({ isOpen, onClose, onSave }: HabitModalProps) => {
  const [habitName, setHabitName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onSave(habitName.trim());
      setHabitName(""); // Reset
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="modal-header">
          <h2>New Habit</h2>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="habitName">What habit are you starting?</label>
            <input
              id="habitName"
              type="text"
              placeholder="e.g. 30 mins Reading"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
