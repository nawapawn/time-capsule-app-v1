"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { CapsuleType, formatViews } from "@/utils/capsuleUtils";
import { Lock, Unlock, Users, User, Eye, Bookmark, Share2, MessageCircle } from "lucide-react";
import Avatar from "./Avatar";

const MOODS = [
  { name: "Happy", emoji: "😄", color: "text-yellow-600" }, 
  { name: "Sad", emoji: "😢", color: "text-blue-600" },
  { name: "Excited", emoji: "🤩", color: "text-red-600" },
  { name: "Calm", emoji: "😌", color: "text-green-600" },
  { name: "Angry", emoji: "😡", color: "text-rose-600" },
  { name: "Tired", emoji: "😴", color: "text-gray-600" },
];

interface CapsuleCardProps {
  capsule: CapsuleType & { mood?: typeof MOODS[0] };
  index: number;
  onBookmark?: (capsule: CapsuleType) => void; 
}

const getVisibilityProps = (visibility: CapsuleType['visibility']) => {
  const effectiveVisibility = visibility || 'private';
  switch (effectiveVisibility) {
    case 'public':
      return { icon: Users, text: 'PUBLIC', className: 'bg-gray-100/70 text-gray-900 shadow-sm shadow-gray-300/30' };
    case 'private':
    default:
      return { icon: User, text: 'PRIVATE', className: 'bg-gray-200 text-gray-800 shadow-sm shadow-gray-400/30' };
  }
};

export default function CapsuleCard({ capsule, onBookmark }: CapsuleCardProps) {
  const unlockDate = capsule.targetDate;
  const [now, setNow] = useState<Date>(new Date());
  const isLocked = unlockDate.getTime() > now.getTime();
  const visibilityProps = getVisibilityProps(capsule.visibility);
  const VisibilityIcon = visibilityProps.icon;

  const creatorName = capsule.creator || 'User';
  const avatarUrl = capsule.creatorAvatar;
  const commentCount = 0;
  const isBookmarked = capsule.bookmarked || false;

  // ⏱ Countdown client-side only
  const [countdown, setCountdown] = useState("Loading...");
  useEffect(() => {
    if (!isLocked) {
      setCountdown("Opened!");
      return;
    }

    const interval = setInterval(() => {
      const diff = unlockDate.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown("Opened!");
        clearInterval(interval);
      } else {
        const totalSeconds = Math.floor(diff / 1000);
        const d = Math.floor(totalSeconds / (60 * 60 * 24));
        const h = Math.floor((totalSeconds / (60 * 60)) % 24);
        const m = Math.floor((totalSeconds / 60) % 60);
        const s = totalSeconds % 60;
        setCountdown(`${d}d ${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockDate, isLocked]);

  // ⭐️ Client-side only unlock date string
  const unlockDateString = useMemo(() => {
    return unlockDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  }, [unlockDate]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col relative min-w-full transition-all hover:shadow-lg">
      {capsule.mood && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md z-10">
          <span className={`text-sm font-medium ${capsule.mood.color}`}>
            {capsule.mood.emoji} {capsule.mood.name}
          </span>
        </div>
      )}

      <div className="relative w-full aspect-video bg-gray-100">
        {capsule.imageSrc && (
          <Image
            src={capsule.imageSrc}
            alt={capsule.title}
            fill
            style={{ objectFit: "cover" }}
            loading="lazy"
            className="transition-all duration-500 ease-in-out hover:scale-105"
          />
        )}

        {isLocked ? (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white/90 text-center p-4">
            <Lock size={30} className="mb-2" />
            <p className="text-sm font-semibold">Locked: Opens on {unlockDateString}</p>
            <div className={`mt-2 inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full ${visibilityProps.className}`}>
              <VisibilityIcon size={10} className="mr-1" />
              {visibilityProps.text}
            </div>
          </div>
        ) : (
          <div className="absolute bottom-2 left-2 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full shadow-md z-10 flex items-center">
            <Unlock size={14} className="text-gray-600 mr-1" />
            <span className="text-xs text-gray-700 font-medium">UNLOCKED</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{capsule.title}</h3>

        <div className="flex items-center gap-2 mt-1">
          <Avatar name={creatorName} size={32} avatarUrl={avatarUrl} />
          <span className="text-xs text-gray-700">@{creatorName}</span>
        </div>

        <div className="border-t pt-2 border-gray-100 text-xs text-gray-500">
          <span className="font-semibold text-blue-600">{isLocked ? `Opening in: ${countdown}` : countdown}</span>
        </div>

        <div className="flex justify-between items-center mt-2">
          {isLocked ? (
            <span className="text-xs text-gray-400 italic">Locked</span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="h-4 w-4" /> {formatViews(capsule.views)}
            </span>
          )}

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => onBookmark && onBookmark(capsule)}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:bg-blue-100 active:scale-110"
              aria-label={isBookmarked ? "Saved" : "Bookmark"}
            >
              <Bookmark className={`h-5 w-5 transition-colors duration-200 ${isBookmarked ? "text-blue-500 fill-blue-500" : "text-gray-400"}`} />
            </button>

            <button
              onClick={() => console.log("Share clicked")}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:bg-blue-100 active:scale-110"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5 text-gray-400" />
            </button>

            <button
              onClick={() => console.log("Comment clicked")}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:bg-blue-100 active:scale-110 relative"
              aria-label="Comments"
            >
              <MessageCircle className="h-5 w-5 text-gray-400" />
              <span className="absolute -right-1 -top-1 text-xs text-gray-500">{commentCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
