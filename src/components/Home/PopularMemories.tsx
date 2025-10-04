"use client";
import React from "react";
import FeedCapsuleCard from "./FeedCapsuleCard";
import { CapsuleType } from "@/utils/capsuleUtils";

interface PopularMemoriesProps {
  popularCapsules: CapsuleType[];
  onBookmark: (capsule: CapsuleType) => void; // เปลี่ยนจาก id -> capsule
  onShare: (capsule: CapsuleType) => void;
}

const PopularMemories: React.FC<PopularMemoriesProps> = ({
  popularCapsules,
  onBookmark,
  onShare,
}) => {
  return (
    <section className="w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Popular Memories
      </h2>
      <div className="flex gap-6 py-4 px-2 overflow-x-auto scrollbar-hide">
        {popularCapsules.map((c, index) => (
          <FeedCapsuleCard
            key={c.id}
            capsule={c}
            onBookmark={() => onBookmark(c)} // ส่ง object แทน id
            onShare={onShare}
            size="small"
            rank={index + 1}
          />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default PopularMemories;
