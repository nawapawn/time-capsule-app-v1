"use client";
import React, { useState, useEffect, RefObject } from "react";
import FeedCapsuleCard from "@/components/Home/FeedCapsuleCard";
import PopularMemories from "@/components/Home/PopularMemories";
import ShareButton from "@/components/Home/ShareButton";
import CreateCapsuleForm from "@/components/CreateCapsuleForm";
import Navbar from "@/components/Navbar";
import { CapsuleType, moodOptions } from "@/utils/capsuleUtils";
import { posts } from "@/data/posts";
import { useCapsule } from "@/context/CapsuleContext";

interface RandomUser {
  name: { first: string; last: string };
  picture: { large: string };
}

const HomePage: React.FC = () => {
  const { feedData, setFeedData, toggleBookmark, isBookmarked } = useCapsule();
  const [popularCapsules, setPopularCapsules] = useState<CapsuleType[]>([]);
  const [shareCapsule, setShareCapsule] = useState<CapsuleType | null>(null);
  const [shareAnchor, setShareAnchor] =
    useState<RefObject<HTMLButtonElement | null> | null>(null);
  const [showCreateCapsuleForm, setShowCreateCapsuleForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersRes = await fetch(
          `https://randomuser.me/api/?results=${posts.length}&inc=name,picture`
        );
        const usersData = await usersRes.json();
        const users: RandomUser[] = usersData.results;

        const capsules: CapsuleType[] = posts.map((title, i) => {
          const user = users[i];
          const mood = moodOptions[i % moodOptions.length];
          return {
            id: i,
            title,
            creator: `${user.name.first} ${user.name.last}`,
            creatorAvatar: user.picture.large,
            imageSrc: `https://picsum.photos/seed/${i}/600/400`,
            mood,
            targetDate: new Date(Date.now() + (i + 1) * 86400000),
            views: Math.floor(Math.random() * 9999) + 100,
            bookmarked: false,
          };
        });

        setFeedData(capsules.reverse());
        setPopularCapsules(
          [...capsules].sort((a, b) => b.views - a.views).slice(0, 10)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setFeedData]);

  const handleShare = (
    capsule: CapsuleType,
    ref: RefObject<HTMLButtonElement | null>
  ) => {
    setShareCapsule(capsule);
    setShareAnchor(ref);
  };

  const handleCreateCapsule = (newCapsule: CapsuleType) => {
    setFeedData((prev) => [newCapsule, ...prev]);
    setShowCreateCapsuleForm(false);
  };

  return (
    <div className="min-h-[80vh] bg-white flex flex-col justify-center pt-16 px-4 pb-8 relative">
      <Navbar onOpenCreateCapsule={() => setShowCreateCapsuleForm(true)} />

      {showCreateCapsuleForm && (
        <CreateCapsuleForm
          onCreate={handleCreateCapsule}
          onClose={() => setShowCreateCapsuleForm(false)}
        />
      )}

      <div className="w-full flex justify-center mt-4">
        <div className="w-full max-w-5xl">
          <PopularMemories
            popularCapsules={popularCapsules.map((c) => ({
              ...c,
              bookmarked: isBookmarked(c.id),
            }))}
            onBookmark={toggleBookmark}
            onShare={(c) => setShareCapsule(c)}
          />
        </div>
      </div>

      <section className="w-full mt-4 flex justify-center">
        <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 w-full rounded-xl bg-gray-200 dark:bg-neutral-700 animate-pulse"
                />
              ))
            : feedData.map((c) => {
                const shareRef = React.createRef<HTMLButtonElement | null>();
                return (
                  <FeedCapsuleCard
                    key={c.id}
                    capsule={{ ...c, bookmarked: isBookmarked(c.id) }}
                    onBookmark={() => toggleBookmark(c)}
                    size="large"
                    onShare={handleShare}
                    shareRef={shareRef}
                  />
                );
              })}
        </div>
      </section>

      {shareCapsule && shareAnchor && (
        <ShareButton capsuleId={shareCapsule.id} shareRef={shareAnchor} />
      )}
    </div>
  );
};

export default HomePage;
