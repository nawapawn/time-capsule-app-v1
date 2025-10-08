// src/components/Avatar.tsx
import React, { useState, useEffect } from "react";

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

  const [imgError, setImgError] = useState(false);

  // 🔄 ถ้า avatarUrl เปลี่ยน ให้ reset imgError
  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const imgSrc = avatarUrl && !imgError ? avatarUrl : "/export-removebg-preview.png";

  return (
    <img
      src={imgSrc}
      alt={`${safeName} Avatar`}
      width={size}
      height={size}
      className="rounded-full object-cover shadow-md"
      onError={() => setImgError(true)}
    />
  );
}
