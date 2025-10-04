"use client";
import React, { RefObject } from "react";
import Navbar from "@/components/Navbar";
import FeedCapsuleCard from "@/components/Home/FeedCapsuleCard";
import { useCapsule } from "@/context/CapsuleContext";
import ShareButton from "@/components/Home/ShareButton";
import { CapsuleType } from "@/utils/capsuleUtils";

const SavedPage: React.FC = () => {
  const { savedData, toggleBookmark, isBookmarked } = useCapsule();
  const [shareCapsule, setShareCapsule] = React.useState<CapsuleType | null>(null);
  const [shareAnchor, setShareAnchor] = React.useState<RefObject<HTMLButtonElement | null> | null>(null);

  const handleShare = (capsule: CapsuleType, ref: RefObject<HTMLButtonElement | null>) => {
    setShareCapsule(capsule);
    setShareAnchor(ref);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4 pb-8">
      <Navbar />

      <h1 className="text-3xl font-bold text-center mb-6">Saved Capsules</h1>

      {savedData.length === 0 ? (
        <p className="text-gray-400 text-lg text-center mt-10 col-span-full">
          You have no saved capsules yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {savedData.map((c) => {
            const shareRef: RefObject<HTMLButtonElement | null> = React.createRef();
            return (
              <FeedCapsuleCard
                key={c.id}
                capsule={{ ...c, bookmarked: isBookmarked(c.id) }}
                onBookmark={() => toggleBookmark(c)}
                onShare={handleShare}
                shareRef={shareRef}
                size="large" // ปรับให้ใหญ่เหมือน SearchPage
              />
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
