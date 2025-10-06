"use client";
import React, { useState, useEffect, RefObject, Suspense } from "react";
import { Eye, Bookmark, Share2, MessageCircle } from "lucide-react";
import { CapsuleType, formatViews } from "@/utils/capsuleUtils";
import CommentBox from "./CommentBox";
import CommentList, { CommentType as CommentItemType } from "./CommentList";
import ProfileAvatar from "../ProfileAvatar";
import Image from "next/image";

// Lazy load FeedCapsuleCard images with Suspense
interface Props {
  capsule: CapsuleType;
  onBookmark: (capsule: CapsuleType) => void;
  onShare?: (
    capsule: CapsuleType,
    ref: RefObject<HTMLButtonElement | null>
  ) => void;
  rank?: number;
  size?: "small" | "large";
  shareRef?: RefObject<HTMLButtonElement | null>;
}

const FeedCapsuleCard: React.FC<Props> = ({
  capsule,
  onBookmark,
  onShare,
  rank,
  size = "large",
  shareRef,
}) => {
  const [countdown, setCountdown] = useState("");
  const [comments, setComments] = useState<CommentItemType[]>([]);
  const [showComments, setShowComments] = useState(false);

  // Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const targetDate = new Date(capsule.targetDate);
      const diff = targetDate.getTime() - now.getTime();
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
    const avatar = `https://i.pravatar.cc/150?img=${(Date.now() % 70) + 1}`;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), user: "GuestUser", avatar, text, replies: [] },
    ]);
  };

  const handleAddReply = (parentId: number, text: string) => {
    const avatar = `https://i.pravatar.cc/150?img=${(Date.now() % 70) + 1}`;
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                { id: Date.now(), user: "GuestUser", avatar, text, replies: [] },
              ],
            }
          : c
      )
    );
  };

  const handleBookmarkClick = () => onBookmark(capsule);
  const handleShareClick = () =>
    onShare && onShare(capsule, shareRef ?? React.createRef());

  const isSmall = size === "small";
  const cardWidth = isSmall ? "min-w-full sm:min-w-[200px]" : "min-w-full";
  const titleSize = isSmall ? "text-base" : "text-lg";
  const avatarSize = isSmall ? 24 : 32;
  const iconSize = isSmall ? 5 : 6;
  const avatarUrl =
    capsule.creatorAvatar ||
    `https://i.pravatar.cc/150?img=${((Number(capsule.id) * 13) % 70) + 1}`;

  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col relative ${cardWidth} transition-all`}
    >
      {capsule.mood && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md z-10">
          <span className={`text-sm font-medium ${capsule.mood.color}`}>
            {capsule.mood.emoji} {capsule.mood.name}
          </span>
        </div>
      )}

      {rank !== undefined && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-white font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md text-sm z-10">
          {rank}
        </div>
      )}

      <div className="relative w-full aspect-video bg-gray-100">
        {capsule.imageSrc && (
          <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-gray-400">Loading...</div>}>
            <Image
              src={capsule.imageSrc}
              alt={capsule.title}
              fill
              style={{ objectFit: "cover" }}
              loading="lazy"
              className="transition-all duration-500 ease-in-out hover:scale-105"
            />
          </Suspense>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        <h3 className={`${titleSize} font-bold text-gray-900 line-clamp-1`}>
          {capsule.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <ProfileAvatar src={avatarUrl} size={avatarSize} />
          <span className="text-xs text-gray-700">@{capsule.creator}</span>
        </div>

        <div className="border-t pt-2 border-gray-100 text-xs text-gray-500">
          <span className="font-semibold text-blue-600">{countdown}</span>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className={`h-${iconSize} w-${iconSize}`} /> {formatViews(capsule.views)}
          </span>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleBookmarkClick}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:bg-blue-100 active:scale-110"
              aria-label={capsule.bookmarked ? "Saved" : "Bookmark"}
            >
              <Bookmark
                className={`h-6 w-6 transition-colors duration-200 ${
                  capsule.bookmarked ? "text-blue-500" : "text-gray-400"
                }`}
              />
            </button>

            <button
              onClick={handleShareClick}
              ref={shareRef ?? undefined}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:bg-blue-100 active:scale-110"
              aria-label="Share"
            >
              <Share2 className={`h-${iconSize} w-${iconSize} text-gray-400`} />
            </button>

            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:bg-blue-100 active:scale-110 relative"
              aria-label="Comments"
            >
              <MessageCircle className={`h-${iconSize} w-${iconSize} text-gray-400`} />
              <span className="absolute -right-1 -top-1 text-xs text-gray-500">
                {comments.length}
              </span>
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
    </div>
  );
};

export default FeedCapsuleCard;
