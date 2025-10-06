// src/components/Avatar.tsx

import React from "react";

type Props = { name?: string; size?: number; avatarUrl?: string };

export default function Avatar({ name, size = 56, avatarUrl }: Props) {
  const safeName = name && name.trim().length > 0 ? name : "User";

  const initials = safeName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const getTextSizeClass = (size: number): string => {
    if (size >= 96) return "text-4xl";
    if (size >= 72) return "text-3xl";
    if (size >= 56) return "text-xl";
    if (size >= 40) return "text-base";
    return "text-sm";
  };

  const textSizeClass = getTextSizeClass(size);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${safeName} Avatar`}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    );
  }

  // ********** ⚪️ Minimal White Theme: Solid Dark Gray/Black Initials 🖤 **********
  return (
    <div
      style={{ width: size, height: size }}
      // 🖤 เปลี่ยนจาก Gradient สีเน้น เป็นสีเทาเข้ม (Solid Gray-900)
      className={`rounded-full bg-gray-900 flex items-center justify-center text-white font-extrabold shadow-md shadow-gray-500/50 ${textSizeClass}`}
    >
      {initials}
    </div>
  );
}