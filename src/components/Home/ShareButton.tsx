// ShareButton component สำหรับ share link ของ capsule
"use client";
import React, { useState, RefObject } from "react";

// Props ของ ShareButton
interface Props {
  capsuleId: number; // id ของ capsule ที่จะ share
  shareRef: RefObject<HTMLButtonElement | null>; // ref ของปุ่ม share
}

const ShareButton: React.FC<Props> = ({ capsuleId, shareRef }) => {
  const [copied, setCopied] = useState(false); // state แสดงว่า copy link แล้วหรือยัง

  // ฟังก์ชัน copy link
  const handleCopy = () => {
    // สร้าง URL แบบ dynamic แล้ว copy ลง clipboard
    navigator.clipboard.writeText(`${window.location.origin}/capsule/${capsuleId}`);
    
    setCopied(true); // แสดง tooltip "Copied!"
    setTimeout(() => setCopied(false), 2000); // 2 วิ tooltip หาย
  };

  return (
    <div className="relative inline-block">
      {/* ปุ่ม share */}
      <button
        ref={shareRef ?? undefined} // ให้ ref จาก parent หรือ undefined
        onClick={handleCopy}
        className="hover:text-blue-500 transition-colors"
      >
        Share
      </button>

      {/* Tooltip ขึ้นเมื่อ copied */}
      {copied && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-md animate-fade-up">
          Copied!
        </span>
      )}
    </div>
  );
};

export default ShareButton;
