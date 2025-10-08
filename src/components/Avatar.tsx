// Avatar component
import React, { useState, useEffect } from "react";

// Props:
// - name: ชื่อผู้ใช้ (ใช้สร้าง initials ถ้าไม่มี avatarUrl)
// - size: ขนาด avatar (default 56px)
// - avatarUrl: URL ของรูป avatar
type Props = { name?: string; size?: number; avatarUrl?: string };

export default function Avatar({ name, size = 56, avatarUrl }: Props) {
  // ถ้า name ไม่มี ให้ default เป็น "User"
  const safeName = name && name.trim().length > 0 ? name : "User";

  // สร้าง initials จากชื่อ (เช่น "John Doe" → "JD")
  const initials = safeName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ฟังก์ชันเลือก class ของ font size ตามขนาด avatar
  const getTextSizeClass = (size: number): string => {
    if (size >= 96) return "text-4xl";
    if (size >= 72) return "text-3xl";
    if (size >= 56) return "text-xl";
    if (size >= 40) return "text-base";
    return "text-sm";
  };

  const textSizeClass = getTextSizeClass(size);

  const [imgError, setImgError] = useState(false); // track ว่ารูปโหลด error หรือไม่

  // 🔄 ถ้า avatarUrl เปลี่ยน ให้ reset imgError
  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  // เลือก src: ถ้า avatarUrl ไม่มีหรือ error → ใช้ default
  const imgSrc = avatarUrl && !imgError ? avatarUrl : "/export-removebg-preview.png";

  return (
    <img
      src={imgSrc} // รูป avatar
      alt={`${safeName} Avatar`} // accessibility
      width={size}
      height={size}
      className="rounded-full object-cover shadow-md" // style
      onError={() => setImgError(true)} // ถ้าโหลดรูปไม่สำเร็จ → fallback
    />
  );
}
