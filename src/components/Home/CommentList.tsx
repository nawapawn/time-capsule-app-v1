// CommentList component สำหรับแสดง list ของ comment และ reply
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Send } from "lucide-react";

// -----------------------------------
// Type สำหรับ comment
// -----------------------------------
export interface CommentType {
  id: number;
  user: string;
  avatar: string;
  text: string;
  replies: CommentType[]; // สำหรับ nested replies
}

// -----------------------------------
// Props: รับ comments array และ callback สำหรับเพิ่ม reply
// -----------------------------------
interface Props {
  comments: CommentType[];
  onAddReply: (parentId: number, text: string) => void;
}

const CommentList: React.FC<Props> = ({ comments, onAddReply }) => {
  // local state สำหรับเปิด reply box ของ comment ไหน
  const [replyBoxId, setReplyBoxId] = useState<number | null>(null);
  // local state สำหรับเก็บข้อความ reply
  const [replyText, setReplyText] = useState("");

  // ส่ง reply ให้ parent
  const handleReplySubmit = (parentId: number) => {
    if (!replyText.trim()) return; // ถ้าว่างไม่ส่ง
    onAddReply(parentId, replyText); // ส่ง callback
    setReplyText(""); // เคลียร์ input
    setReplyBoxId(null); // ปิด reply box
  };

  // กด Enter ส่ง reply (Shift+Enter เว้นบรรทัด)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, parentId: number) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReplySubmit(parentId);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      {comments.map((c) => (
        <div key={c.id} className="border-b pb-2">
          {/* Header: avatar + user name */}
          <div className="flex items-center gap-2">
            <Image
              src={c.avatar}
              alt={c.user}
              width={24}
              height={24}
              className="rounded-full border border-gray-200 object-cover"
            />
            <span className="text-sm font-semibold">{c.user}</span>
          </div>

          {/* Text ของ comment */}
          <p className="text-sm ml-8">{c.text}</p>

          {/* ปุ่ม Reply */}
          <button
            onClick={() => setReplyBoxId(c.id === replyBoxId ? null : c.id)}
            className="text-xs text-blue-600 hover:underline ml-8 mt-1"
          >
            Reply
          </button>

          {/* Reply Box */}
          {replyBoxId === c.id && (
            <div className="mt-1 ml-8 flex gap-2 items-center">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, c.id)}
                placeholder="Write a reply..."
                className="flex-1 border border-gray-300 rounded-xl px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
              <button
                onClick={() => handleReplySubmit(c.id)}
                aria-label="Send reply"
                title="Send reply"
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>
          )}

          {/* Replies ของ comment */}
          {c.replies.length > 0 && (
            <div className="ml-8 mt-1 flex flex-col gap-1">
              {c.replies.map((r) => (
                <div key={r.id} className="flex items-center gap-2">
                  <Image
                    src={r.avatar}
                    alt={r.user}
                    width={20}
                    height={20}
                    className="rounded-full border border-gray-200 object-cover"
                  />
                  <span className="text-sm text-gray-600">{r.user}: {r.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
