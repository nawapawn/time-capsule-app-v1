// moood pick
"use client";

import React from "react";

// -----------------------------------
// Mood options ที่ให้เลือก
// -----------------------------------
const moodOptions = [
  { name: "Happy", emoji: "😄" },
  { name: "Sad", emoji: "😢" },
  { name: "Excited", emoji: "🤩" },
  { name: "Calm", emoji: "😌" },
  { name: "Angry", emoji: "😡" },
  { name: "Tired", emoji: "😴" },
];

// -----------------------------------
// Props ของ MoodPicker
// -----------------------------------
interface MoodPickerProps {
  selectedMood: string[]; // moods ที่เลือกแล้ว (หลายตัว)
  onToggleMood: (mood: string) => void; // callback toggle mood
}

// -----------------------------------
// Component
// -----------------------------------
const MoodPicker: React.FC<MoodPickerProps> = ({ selectedMood, onToggleMood }) => (
  <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
    {moodOptions.map((m, i) => (
      <button
        key={i} // key ต้องไม่ซ้ำ
        type="button"
        onClick={() => onToggleMood(m.name)} // toggle mood
        className={`px-3 py-1 rounded-full text-sm sm:text-base border ${
          selectedMood.includes(m.name)
            ? "bg-blue-600 text-white border-blue-600" // ถ้าเลือกแล้ว
            : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100" // ถ้ายังไม่ได้เลือก
        }`}
        aria-label={`Select mood ${m.name}`} // accessibility
      >
        {m.emoji} {m.name} {/* แสดง emoji + ชื่อ mood */}
      </button>
    ))}
  </div>
);

export default MoodPicker;
