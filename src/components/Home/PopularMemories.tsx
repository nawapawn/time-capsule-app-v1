"use client";
import React from "react";
import FeedCapsuleCard from "./FeedCapsuleCard";
import { CapsuleType } from "@/utils/capsuleUtils";

interface PopularMemoriesProps {
  popularCapsules: CapsuleType[];
  onBookmark: (id: number) => void;
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
            onBookmark={onBookmark}
            onShare={onShare}
            size="small"
            rank={index + 1}
          />
        ))}
      </div>

      {/* Custom Scrollbar Hiding */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE/Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
      `}</style>
    </section>
  );
};

export default PopularMemories;
