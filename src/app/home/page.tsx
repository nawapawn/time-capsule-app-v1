"use client";
import React, { useEffect, useState, RefObject } from "react";
import FeedCapsuleCard from "@/components/Home/FeedCapsuleCard";
import PopularMemories from "@/components/Home/PopularMemories";
import ShareButton from "@/components/Home/ShareButton";
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
  const [shareAnchor, setShareAnchor] = useState<RefObject<HTMLButtonElement | null> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch("https://randomuser.me/api/?results=20&inc=name,picture");
        const usersData = await usersRes.json();
        const users: RandomUser[] = usersData.results;

        const capsules: CapsuleType[] = posts.slice(0, 20).map((title, i) => {
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

        setFeedData(capsules);
        setPopularCapsules(capsules.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleBookmark = (id: number) => {
    setFeedData(prev => prev.map(c => (c.id === id ? { ...c, bookmarked: !c.bookmarked } : c)));
    setPopularCapsules(prev => prev.map(c => (c.id === id ? { ...c, bookmarked: !c.bookmarked } : c)));
  };

  const handleShare = (capsule: CapsuleType, ref: RefObject<HTMLButtonElement | null>) => {
    setShareCapsule(capsule);
    setShareAnchor(ref);
  };

  return (
    <div className="min-h-[80vh] bg-white flex justify-center pt-16 px-4 pb-8 relative">
      <main className="w-full max-w-3xl flex flex-col gap-16 items-center">
        <PopularMemories popularCapsules={popularCapsules} onBookmark={handleBookmark} onShare={(c) => setShareCapsule(c)} />
        <section className="w-full">
          <div className="grid grid-cols-1 gap-6 justify-items-center">
            {feedData.map((c) => {
              const shareRef: RefObject<HTMLButtonElement | null> = React.createRef<HTMLButtonElement>();
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
      </main>

      {shareCapsule && shareAnchor && (
        <ShareButton capsuleId={shareCapsule.id} shareRef={shareAnchor} />
      )}
    </div>
  );
};

export default HomePage;
