// PopularMemories component สำหรับแสดง popular capsules ในหน้า home
"use client";
import React from "react";
import FeedCapsuleCard from "./FeedCapsuleCard";
import { CapsuleType } from "@/utils/capsuleUtils";
import { motion } from "framer-motion";

// Props ของ PopularMemories
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
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
        Popular Memories
      </h2>

      {/* Horizontal scroll container */}
      <div className="flex gap-4 sm:gap-6 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
        {popularCapsules.map((c, index) => (
          <motion.div
            key={c.id}
            whileHover={{ scale: 1.05, y: -5 }} // การ์ดยกขึ้นเวลาชี้
            whileTap={{ scale: 0.95 }} // ย่อเวลาคลิก
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex-shrink-0 w-48 sm:w-56 md:w-64 h-72 sm:h-80" // responsive ขนาดการ์ด
          >
            {/* ใช้ FeedCapsuleCard ขนาด small */}
            <FeedCapsuleCard
              capsule={c}
              onBookmark={() => onBookmark(c)}
              onShare={() => onShare(c)}
              size="small"
              rank={index + 1} // แสดงอันดับ
            />
          </motion.div>
        ))}
      </div>

      {/* CSS ซ่อน scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }
      `}</style>
    </section>
  );
};

export default PopularMemories;
