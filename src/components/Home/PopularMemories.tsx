"use client";
import React from "react";
import FeedCapsuleCard from "./FeedCapsuleCard";
import { CapsuleType } from "@/utils/capsuleUtils";
import { motion } from "framer-motion";

interface PopularMemoriesProps {
  popularCapsules: CapsuleType[];
  onBookmark: (capsule: CapsuleType) => void;
  onShare: (capsule: CapsuleType) => void;
}

const PopularMemories: React.FC<PopularMemoriesProps> = ({
  popularCapsules,
  onBookmark,
  onShare,
}) => {
  return (
    <section className="w-full px-2 sm:px-4 md:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
        Popular Memories
      </h2>
      <div className="flex gap-4 sm:gap-6 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
        {popularCapsules.map((c, index) => (
          <motion.div
            key={c.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex-shrink-0 w-48 sm:w-56 md:w-64 h-72 sm:h-80" // responsive ขนาดการ์ด
          >
            <FeedCapsuleCard
              capsule={c}
              onBookmark={() => onBookmark(c)}
              onShare={() => onShare(c)}
              size="small"
              rank={index + 1}
            />
          </motion.div>
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
