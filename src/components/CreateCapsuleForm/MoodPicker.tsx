"use client";
import React from "react";

const moodOptions = [
  { name: "Happy", emoji: "😄" },
  { name: "Sad", emoji: "😢" },
  { name: "Excited", emoji: "🤩" },
  { name: "Calm", emoji: "😌" },
  { name: "Angry", emoji: "😡" },
  { name: "Tired", emoji: "😴" },
];

interface MoodPickerProps {
  selectedMood: string[];
  onToggleMood: (mood: string) => void;
}

const MoodPicker: React.FC<MoodPickerProps> = ({ selectedMood, onToggleMood }) => (
  <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
    {moodOptions.map((m, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onToggleMood(m.name)}
        className={`px-3 py-1 rounded-full text-sm sm:text-base border ${
          selectedMood.includes(m.name)
            ? "bg-blue-600 text-white border-blue-600"
            : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
        }`}
        aria-label={`Select mood ${m.name}`}
      >
        {m.emoji} {m.name}
      </button>
    ))}
  </div>
);

export default MoodPicker;
