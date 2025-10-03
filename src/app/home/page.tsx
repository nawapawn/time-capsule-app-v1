"use client";
import React, { useState } from "react";

import FeedCapsuleCard from "@/components/FeedCapsuleCard";
import PopularMemories from "@/components/PopularMemories";
import ShareButton from "@/components/ShareButton"; 
import {
  CapsuleType,
  generateCapsulesFromTitles,
  popularMemoryTitles,
  publicFeedTitles,
} from "@/utils/capsuleUtils";

const HomePage: React.FC = () => {
  const [feedType, setFeedType] = useState<"all" | "following">("all");
  const [feedData, setFeedData] = useState<CapsuleType[]>([]);
  const [popularCapsules, setPopularCapsules] = useState<CapsuleType[]>([]);
  const [shareCapsule, setShareCapsule] = useState<CapsuleType | null>(null);
  const [shareAnchor, setShareAnchor] = useState<React.RefObject<HTMLButtonElement> | null>(null);

  React.useEffect(() => {
    setPopularCapsules(generateCapsulesFromTitles(popularMemoryTitles));
  }, []);

  React.useEffect(() => {
    setFeedData(
      feedType === "all"
        ? generateCapsulesFromTitles(publicFeedTitles)
        : []
    );
  }, [feedType]);

  const handleBookmark = (id: number) => {
    setFeedData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, bookmarked: !c.bookmarked } : c))
    );
    setPopularCapsules((prev) =>
      prev.map((c) => (c.id === id ? { ...c, bookmarked: !c.bookmarked } : c))
    );
  };

  const handleShare = (capsule: CapsuleType, ref: React.RefObject<HTMLButtonElement>) => {
    setShareCapsule(capsule);
    setShareAnchor(ref);
  };

  // สำหรับ PopularMemories ที่ onShare รับแค่ 1 argument
  const handlePopularMemoryShare = (capsule: CapsuleType) => {
    setShareCapsule(capsule);
    setShareAnchor(null);
  };

  return (
    <div className="min-h-[80vh] bg-white flex justify-center pt-16 px-4 pb-8 relative">
      <main className="w-full max-w-3xl flex flex-col gap-16 items-center">
        <PopularMemories
          popularCapsules={popularCapsules}
          onBookmark={handleBookmark}
          onShare={handlePopularMemoryShare} 
        />

        <section className="w-full">
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setFeedType("all")}
              className={`px-6 py-2 rounded-full font-semibold transition-colors shadow-md ${
                feedType === "all"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFeedType("following")}
              className={`px-6 py-2 rounded-full font-semibold transition-colors shadow-md ${
                feedType === "following"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              Following
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 justify-items-center">
            {feedData.map((c) => {
              // 🔹 แก้ TypeScript ด้วย cast เป็น RefObject<HTMLButtonElement> แบบ non-null
              const shareRef = React.createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>;
              return (
                <FeedCapsuleCard
                  key={`feed-${c.id}`}
                  capsule={c}
                  onBookmark={handleBookmark}
                  size="large"
                  onShare={handleShare}
                  shareRef={shareRef}
                />
              );
            })}
          </div>
        </section>
      </main>

      {shareCapsule && shareAnchor && (
        <ShareButton
          capsuleId={shareCapsule.id}
          shareRef={shareAnchor}
        />
      )}
    </div>
  );
};

export default HomePage;
