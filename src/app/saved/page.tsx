"use client";
import React, { RefObject } from "react";
import Navbar from "@/components/Navbar";
import FeedCapsuleCard from "@/components/Home/FeedCapsuleCard";
import { useCapsule } from "@/context/CapsuleContext";
import ShareButton from "@/components/Home/ShareButton";
import { CapsuleType } from "@/utils/capsuleUtils";
import { motion } from "framer-motion";

const SavedPage: React.FC = () => {
  const { savedData, toggleBookmark, isBookmarked } = useCapsule();
  const [shareCapsule, setShareCapsule] = React.useState<CapsuleType | null>(null);
  const [shareAnchor, setShareAnchor] = React.useState<RefObject<HTMLButtonElement | null> | null>(null);

  const handleShare = (capsule: CapsuleType, ref: RefObject<HTMLButtonElement | null>) => {
    setShareCapsule(capsule);
    setShareAnchor(ref);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex flex-col items-center pt-20 px-4 pb-8 transition-colors">
      <Navbar />

      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100 transition-colors">
        Saved Capsules
      </h1>

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
                  capsule={{ ...c, bookmarked: isBookmarked(c.id) }}
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

      {shareCapsule && shareAnchor && (
        <ShareButton capsuleId={shareCapsule.id} shareRef={shareAnchor} />
      )}
    </div>
  );
};

export default SavedPage;
