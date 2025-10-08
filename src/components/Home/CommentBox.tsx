// CommentBox component สำหรับพิมพ์ comment
"use client";
import React, { useState } from "react";
import { Send } from "lucide-react";

// -----------------------------------
// Props: parent ต้องส่ง onAddComment(text) มา
// -----------------------------------
interface Props {
  onAddComment: (text: string) => void;
}

const CommentBox: React.FC<Props> = ({ onAddComment }) => {
  // local state เก็บข้อความใน input
  const [text, setText] = useState("");

  // ฟังก์ชันส่ง comment
  const handleSubmit = () => {
    if (!text.trim()) return; // ถ้าว่างหรือมีแต่ space ก็ไม่ส่ง
    onAddComment(text); // เรียก callback ให้ parent
    setText(""); // เคลียร์ input หลังส่ง
  };

  // กด Enter ส่ง comment (Shift+Enter เว้นบรรทัด)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // ป้องกัน default
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {/* Input */}
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown} // ส่ง comment ด้วย Enter
        className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
      />

      {/* ปุ่มส่ง */}
      <button
        onClick={handleSubmit}
        aria-label="Send comment"
        title="Send comment"
        className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition flex items-center justify-center"
      >
        <Send size={16} /> {/* icon ส่ง */}
      </button>
    </div>
  );
};

export default CommentBox;
