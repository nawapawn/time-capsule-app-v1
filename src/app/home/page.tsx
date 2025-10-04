// src/app/home/page.tsx
"use client";
import React, { useState, RefObject } from "react";
import FeedCapsuleCard from "@/components/Home/FeedCapsuleCard";
import PopularMemories from "@/components/Home/PopularMemories";
import ShareButton from "@/components/Home/ShareButton";
import CreateCapsuleForm from "@/components/CreateCapsuleForm";
import Navbar from "@/components/Navbar"; // สมมติ Navbar มี prop onOpenCreateCapsule
import { CapsuleType, moodOptions } from "@/utils/capsuleUtils";
import { posts } from "@/data/posts";

interface RandomUser {
  name: { first: string; last: string };
  picture: { large: string };
}

const HomePage: React.FC = () => {
  const [feedData, setFeedData] = useState<CapsuleType[]>([]);
  const [popularCapsules, setPopularCapsules] = useState<CapsuleType[]>([]);
  const [shareCapsule, setShareCapsule] = useState<CapsuleType | null>(null);
  const [shareAnchor, setShareAnchor] =
    useState<RefObject<HTMLButtonElement | null> | null>(null);
  const [showCreateCapsuleForm, setShowCreateCapsuleForm] = useState(false);

  // โหลดข้อมูลเริ่มต้น
  React.useEffect(() => {
    const fetchData = async () => {
      try {
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
      }
    };
    fetchData();
  }, []);

  // ฟังก์ชัน Bookmark
  const handleBookmark = (id: number) => {
    setFeedData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, bookmarked: !c.bookmarked } : c))
    );
    setPopularCapsules((prev) =>
      prev.map((c) => (c.id === id ? { ...c, bookmarked: !c.bookmarked } : c))
    );
  };

  // ฟังก์ชัน Share
  const handleShare = (
    capsule: CapsuleType,
    ref: RefObject<HTMLButtonElement | null>
  ) => {
    setShareCapsule(capsule);
    setShareAnchor(ref);
  };

  // ฟังก์ชันเพิ่ม Capsule ใหม่
  const handleCreateCapsule = (newCapsule: CapsuleType) => {
    setFeedData((prev) => [newCapsule, ...prev]); // เพิ่มบนสุดของ Feed
    setShowCreateCapsuleForm(false);
  };

  return (
    <div className="min-h-[80vh] bg-white flex flex-col justify-center pt-16 px-4 pb-8 relative">
      {/* Navbar */}
      <Navbar onOpenCreateCapsule={() => setShowCreateCapsuleForm(true)} />

      {/* ฟอร์มสร้าง Capsule */}
      {showCreateCapsuleForm && (
        <CreateCapsuleForm
          onCreate={handleCreateCapsule}
          onClose={() => setShowCreateCapsuleForm(false)}
        />
      )}

      {/* Popular Capsules */}
      <div className="w-full flex justify-center mt-4">
        <div className="w-full max-w-5xl">
          <PopularMemories
            popularCapsules={popularCapsules}
            onBookmark={handleBookmark}
            onShare={(c) => setShareCapsule(c)}
          />
        </div>
      </div>

      {/* Feed */}
      <section className="w-full mt-4 flex justify-center">
        <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
          {feedData.map((c) => {
            const shareRef: RefObject<HTMLButtonElement | null> =
              React.createRef();
            return (
              <FeedCapsuleCard
                key={c.id}
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

      {/* Share button */}
      {shareCapsule && shareAnchor && (
        <ShareButton capsuleId={shareCapsule.id} shareRef={shareAnchor} />
      )}
    </div>
  );
};

export default HomePage;
