"use client";
import React, { useState, useEffect, RefObject } from "react";
import FeedCapsuleCard from "@/components/Home/FeedCapsuleCard";
import { CapsuleType, moodOptions } from "@/utils/capsuleUtils";
import { posts } from "@/data/posts";
import ShareButton from "@/components/Home/ShareButton";
import { useCapsule } from "@/context/CapsuleContext";
import { motion } from "framer-motion";

interface RandomUser {
  name: { first: string; last: string };
  picture: { large: string };
  login: { uuid: string };
}

const SearchPage: React.FC = () => {
  const { toggleBookmark, isBookmarked } = useCapsule();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CapsuleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [shareCapsule, setShareCapsule] = useState<CapsuleType | null>(null);
  const [shareAnchor, setShareAnchor] =
    useState<RefObject<HTMLButtonElement | null> | null>(null);

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
          const capsuleId = (
            parseInt(user.login.uuid.replace(/-/g, ""), 16) % 1000000
          ).toString(); // number

          return {
            id: capsuleId, // ✅ number
            title,
            content: `This is a content for ${title}`, // ✅ content ต้องมี
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

  const filteredResults = results.filter(
    (c) =>
      c.title.toLowerCase().startsWith(query.toLowerCase()) ||
      c.creator.toLowerCase().startsWith(query.toLowerCase())
  );

  const handleShare = (
    capsule: CapsuleType,
    ref: RefObject<HTMLButtonElement | null>
  ) => {
    setShareCapsule(capsule);
    setShareAnchor(ref);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-4 pt-20 flex flex-col items-center transition-colors">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100 transition-colors">
        Search Capsules
      </h1>

      <div className="w-full max-w-xl mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or creator..."
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-neutral-100 transition-colors"
        />
      </div>

      {loading && (
        <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">
          Loading...
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-6xl">
        {filteredResults.length > 0
          ? filteredResults.map((c) => {
              const shareRef = React.createRef<HTMLButtonElement | null>();
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
            })
          : !loading && (
              <p className="text-center text-gray-400 dark:text-gray-500 col-span-full transition-colors">
                No results found.
              </p>
            )}
      </div>

      {shareCapsule && shareAnchor && (
        <ShareButton
          capsuleId={Number(shareCapsule.id)}
          shareRef={shareAnchor}
        />
      )}
    </div>
  );
};

export default SearchPage;
