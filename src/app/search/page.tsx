"use client";
import React, { useState, useEffect, RefObject } from "react";
import FeedCapsuleCard from "@/components/Home/FeedCapsuleCard";
import { CapsuleType, moodOptions } from "@/utils/capsuleUtils";
import { posts } from "@/data/posts";
import ShareButton from "@/components/Home/ShareButton";

interface RandomUser {
  name: { first: string; last: string };
  picture: { large: string };
  login: { uuid: string };
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CapsuleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [shareCapsule, setShareCapsule] = useState<CapsuleType | null>(null);
  const [shareAnchor, setShareAnchor] =
    useState<RefObject<HTMLButtonElement | null> | null>(null);

  // สุ่มโพสต์เหมือน feed
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersRes = await fetch(
          `https://randomuser.me/api/?results=${posts.length}&inc=name,picture,login`
        );
        const usersData = await usersRes.json();
        const users: RandomUser[] = usersData.results;

        const capsules: CapsuleType[] = posts.map((title, i) => {
          const user = users[i];
          const mood = moodOptions[i % moodOptions.length];
          return {
            id: parseInt(user.login.uuid.replace(/-/g, ""), 16) % 1000000,
            title,
            creator: `${user.name.first} ${user.name.last}`,
            creatorAvatar: user.picture.large,
            imageSrc: `https://picsum.photos/seed/${i}/400/600`,
            mood,
            targetDate: new Date(Date.now() + (i + 1) * 86400000),
            views: Math.floor(Math.random() * 5000) + 100,
            bookmarked: false,
          };
        });

        setResults(capsules);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // ฟิลเตอร์ตาม query: ตัวแรกของชื่อหรือ title
  const filteredResults = results.filter(
    (c) =>
      c.title.toLowerCase().startsWith(query.toLowerCase()) ||
      c.creator.toLowerCase().startsWith(query.toLowerCase())
  );

  const handleBookmark = (id: number) => {
    setResults((prev) =>
      prev.map((c) => (c.id === id ? { ...c, bookmarked: !c.bookmarked } : c))
    );
  };

  const handleShare = (capsule: CapsuleType, ref: RefObject<HTMLButtonElement | null>) => {
    setShareCapsule(capsule);
    setShareAnchor(ref);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-20 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-6">Search Capsules</h1>

      <div className="w-full max-w-xl mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or creator..."
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && <p className="text-gray-500 mb-4">Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {filteredResults.map((c) => {
          const shareRef: RefObject<HTMLButtonElement | null> = React.createRef();
          return (
            <FeedCapsuleCard
              key={c.id}
              capsule={c}
              onBookmark={handleBookmark}
              onShare={handleShare}
              shareRef={shareRef}
              size="large"
            />
          );
        })}
        {filteredResults.length === 0 && !loading && (
          <p className="text-center text-gray-400 col-span-full">No results found.</p>
        )}
      </div>

      {shareCapsule && shareAnchor && (
        <ShareButton capsuleId={shareCapsule.id} shareRef={shareAnchor} />
      )}
    </div>
  );
};

export default SearchPage;
