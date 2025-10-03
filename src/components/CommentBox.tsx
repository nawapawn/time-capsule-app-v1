"use client";
import React, { useState } from "react";
import { Send } from "lucide-react";

interface Props {
  onAddComment: (text: string) => void;
}

const CommentBox: React.FC<Props> = ({ onAddComment }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddComment(text);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
      />
      <button
        onClick={handleSubmit}
        aria-label="Send comment"
        title="Send comment"
        className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition flex items-center justify-center"
      >
        <Send size={16} />
      </button>
    </div>
  );
};

export default CommentBox;
