// ProfileAvatar component สำหรับแสดง avatar ของ user
"use client"; // บอก Next.js ว่า component นี้รันบน client เพราะใช้ dynamic image

import React from "react";
import Image from "next/image";

// Props สำหรับ avatar
interface ProfileAvatarProps {
  src?: string;       // URL ของรูป avatar (optional)
  alt?: string;       // alt text ของรูป
  size?: number;      // ขนาด width/height ของรูป
  className?: string; // class เพิ่มเติม
}

// Component Avatar
const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ src, alt = "User Avatar", size = 32, className }) => {
  return (
    <Image
      src={src || "/default_avatar.png"} // ถ้าไม่มีรูป ใช้ default avatar
      alt={alt}                          // alt สำหรับ accessibility
      width={size}                       // กำหนดขนาด width
      height={size}                      // กำหนดขนาด height
      className={`rounded-full border border-gray-200 object-cover ${className || ""}`} 
      // Tailwind:
      // rounded-full = ทำให้เป็นวงกลม
      // border + border-gray-200 = เส้นขอบบางสีเทา
      // object-cover = ให้รูปเต็มกรอบโดยไม่บิด
      // เพิ่ม class จาก props ถ้ามี
      unoptimized // ป้องกัน Next.js optimize images สำหรับ dynamic URLs
    />
  );
};

export default ProfileAvatar;
