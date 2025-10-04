// src/components/Home/FeedCapsuleCard.tsx
"use client";
import React, { useState, useEffect, RefObject } from "react";
import Image from "next/image";
import { Eye, Bookmark, Share2, MessageCircle } from "lucide-react";
import { CapsuleType, formatViews } from "@/utils/capsuleUtils";
import CommentBox from "./CommentBox";
import CommentList, { CommentType as CommentItemType } from "./CommentList";
import ProfileAvatar from "../ProfileAvatar";

interface Props {
  capsule: CapsuleType;
  onBookmark: (id: number) => void;
  onShare?: (capsule: CapsuleType, ref: RefObject<HTMLButtonElement | null>) => void;
  rank?: number;
  size?: "small" | "large";
  shareRef?: RefObject<HTMLButtonElement | null>;
}

const FeedCapsuleCard: React.FC<Props> = ({ capsule, onBookmark, onShare, rank, size = "large", shareRef }) => {
  const [countdown, setCountdown] = useState("");
  const [comments, setComments] = useState<CommentItemType[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = capsule.targetDate.getTime() - now.getTime();
      if (diff <= 0) setCountdown("Opened!");
      else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setCountdown(`${d}d ${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [capsule.targetDate]);

  const handleAddComment = (text: string) => {
    setComments(prev => [
      ...prev,
      { id: Date.now(), user: "GuestUser", avatar: "/default_avatar.png", text, replies: [] },
    ]);
  };

  const handleAddReply = (parentId: number, text: string) => {
    setComments(prev =>
      prev.map(c =>
        c.id === parentId
          ? { ...c, replies: [...c.replies, { id: Date.now(), user: "GuestUser", avatar: "/default_avatar.png", text, replies: [] }] }
          : c
      )
    );
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(`${window.location.origin}/capsule/${capsule.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareClick = () => {
    if (onShare) onShare(capsule, shareRef ?? React.createRef<HTMLButtonElement>());
    handleCopyClick();
  };

  const isSmall = size === "small";
  const cardWidth = isSmall ? "min-w-[220px] max-w-[220px]" : "min-w-full";
  const titleSize = isSmall ? "text-base" : "text-lg";
  const avatarSize = isSmall ? 24 : 32;
  const iconSize = isSmall ? 5 : 6;

  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col relative ${cardWidth}`}>
      {rank !== undefined && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-white font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md text-sm z-10">
          {rank}
        </div>
      )}

      {/* รูปโพสต์ */}
      <div className="relative w-full aspect-video bg-gray-100">
        {capsule.imageSrc ? (
          <Image src={capsule.imageSrc} alt={capsule.title} fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
            <span>No Image</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        <h3 className={`${titleSize} font-bold text-gray-900 line-clamp-1`}>{capsule.title}</h3>

        {/* โปรไฟล์ */}
        <div className="flex items-center gap-2 mt-1">
          <ProfileAvatar src={capsule.creatorAvatar} size={avatarSize} />
          <span className="text-xs text-gray-700">@{capsule.creator}</span>
        </div>

        <div className="border-t pt-2 border-gray-100 text-xs text-gray-500">
          <span className="font-semibold text-blue-600">{countdown}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-2">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className={`h-${iconSize} w-${iconSize}`} /> {formatViews(capsule.views)}
          </span>

          <div className="flex gap-3 relative">
            {/* Bookmark */}
            <button
              onClick={() => onBookmark(capsule.id)}
              className="hover:text-blue-500 transition-colors flex items-center gap-1"
              aria-label={capsule.bookmarked ? "Saved" : "Bookmark"}
              title={capsule.bookmarked ? "Saved" : "Bookmark"}
            >
              {capsule.bookmarked ? (
                <span className="text-blue-600 font-semibold text-sm">Saved</span>
              ) : (
                <Bookmark className={`h-${iconSize} w-${iconSize} text-gray-400`} />
              )}
            </button>

            {/* Share */}
            <div className="relative">
              <button
                onClick={handleShareClick}
                ref={shareRef ?? undefined}
                className="hover:text-blue-500 transition-colors"
                aria-label="Share"
                title="Share"
              >
                <Share2 className={`h-${iconSize} w-${iconSize} text-gray-400`} />
              </button>
              {copied && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-md animate-fade-up">
                  Copied!
                </span>
              )}
            </div>

            {/* Comments */}
            <button
              onClick={() => setShowComments(prev => !prev)}
              className="hover:text-blue-500 transition-colors flex items-center gap-1"
              aria-label="Comments"
              title="Comments"
            >
              <MessageCircle className={`h-${iconSize} w-${iconSize} text-gray-400`} />
              <span className="text-xs text-gray-500">{comments.length}</span>
            </button>
          </div>
        </div>

        {showComments && (
          <div className="mt-3 border-t border-gray-100 pt-2">
            <CommentBox onAddComment={handleAddComment} />
            <CommentList comments={comments} onAddReply={handleAddReply} />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(4px);
          }
          50% {
            opacity: 1;
            transform: translateY(-2px);
          }
          100% {
            opacity: 0;
            transform: translateY(-8px);
          }
        }
        .animate-fade-up {
          animation: fadeUp 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FeedCapsuleCard;
