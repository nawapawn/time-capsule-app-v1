// Saved Capsules Page
"use client";

import React, { RefObject } from "react";
import Navbar from "@/components/Navbar";
import FeedCapsuleCard from "@/components/Home/FeedCapsuleCard"; // ปรับ path ให้ตรงกับโปรเจกต์
import { useCapsule } from "@/context/CapsuleContext"; // ต้องมี CapsuleContext
import ShareButton from "@/components/Home/ShareButton"; // ปรับ path ให้ตรง
import { CapsuleType } from "@/utils/capsuleUtils";
import { motion } from "framer-motion";

// ==============================
// Component
// ==============================
const Page: React.FC = () => {
  // hook จาก context ของ capsule
  const { savedData, toggleBookmark, isBookmarked } = useCapsule();

  // state สำหรับ share modal
  const [shareCapsule, setShareCapsule] = React.useState<CapsuleType | null>(null);
  const [shareAnchor, setShareAnchor] = React.useState<RefObject<HTMLButtonElement | null> | null>(null);

  // ฟังก์ชัน handle share
  const handleShare = (capsule: CapsuleType, ref: RefObject<HTMLButtonElement | null>) => {
    setShareCapsule(capsule);
    setShareAnchor(ref);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex flex-col items-center pt-20 px-4 pb-8 transition-colors">
      {/* Navbar ถ้าใช้ layout แล้ว อาจลบตรงนี้ */}
      <Navbar />

      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100 transition-colors">
        Saved Capsules
      </h1>

      {/* หากยังไม่มี saved capsules */}
      {savedData.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-400 text-lg text-center mt-10 col-span-full transition-colors">
          You have no saved capsules yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-6xl">
          {savedData.map((c) => {
            const shareRef: RefObject<HTMLButtonElement | null> = React.createRef();

            return (
              <motion.div
                key={c.id}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <FeedCapsuleCard
                  capsule={{ ...c, bookmarked: isBookmarked(Number(c.id)) }}
                  onBookmark={() => toggleBookmark(c)}
                  onShare={handleShare}
                  shareRef={shareRef}
                  size="large"
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Share button modal */}
      {shareCapsule && shareAnchor && (
        <ShareButton capsuleId={Number(shareCapsule.id)} shareRef={shareAnchor} />
      )}
    </div>
  );
};

export default Page;
