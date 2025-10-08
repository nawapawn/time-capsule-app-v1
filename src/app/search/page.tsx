// Search Page
"use client";
import React, { useState, useEffect, RefObject } from "react";
import FeedCapsuleCard from "@/components/Home/FeedCapsuleCard"; // Card component ของแต่ละ Capsule
import { CapsuleType, moodOptions } from "@/utils/capsuleUtils"; // Type และ mood options
import { posts } from "@/data/posts"; // ข้อมูล mock posts
import ShareButton from "@/components/Home/ShareButton"; // ปุ่มแชร์ Capsule
import { useCapsule } from "@/context/CapsuleContext"; // Context สำหรับ bookmark / saved
import { motion } from "framer-motion"; // Animation

// Interface สำหรับ fetch random user
interface RandomUser {
  name: { first: string; last: string };
  picture: { large: string };
  login: { uuid: string };
}

const SearchPage: React.FC = () => {
  const { toggleBookmark, isBookmarked } = useCapsule(); // hook ของ CapsuleContext
  const [query, setQuery] = useState(""); // คำค้นหา
  const [results, setResults] = useState<CapsuleType[]>([]); // array ของ Capsule หลัง fetch
  const [loading, setLoading] = useState(false); // loading state
  const [shareCapsule, setShareCapsule] = useState<CapsuleType | null>(null); // capsule ที่จะแชร์
  const [shareAnchor, setShareAnchor] =
    useState<RefObject<HTMLButtonElement | null> | null>(null); // ref ของปุ่มแชร์

  // 🔹 useEffect สำหรับ fetch ข้อมูล
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // เริ่ม loading
      try {
        // fetch user mock จาก randomuser.me
        const usersRes = await fetch(
          `https://randomuser.me/api/?results=${posts.length}&inc=name,picture,login`
        );
        const usersData = await usersRes.json();
        const users: RandomUser[] = usersData.results;

        // map posts + users → สร้าง CapsuleType[]
        const capsules: CapsuleType[] = posts.map((title, i) => {
          const user = users[i];
          const mood = moodOptions[i % moodOptions.length]; // mood แบบวนลูป
          const capsuleId = (
            parseInt(user.login.uuid.replace(/-/g, ""), 16) % 1000000
          ).toString(); // แปลง UUID เป็น number string สำหรับ id

          return {
            id: capsuleId, // id ของ capsule
            title, // title จาก posts
            content: `This is a content for ${title}`, // placeholder content
            creator: `${user.name.first} ${user.name.last}`, // creator จาก random user
            creatorAvatar: user.picture.large, // avatar ของ creator
            imageSrc: `https://picsum.photos/seed/${i}/400/600`, // placeholder image
            mood, // mood
            targetDate: new Date(Date.now() + (i + 1) * 86400000), // target date +1 วันต่อ index
            views: Math.floor(Math.random() * 5000) + 100, // views แบบ random
            bookmarked: false, // default ไม่ bookmarked
          };
        });

        setResults(capsules); // save results ใน state
      } catch (err) {
        console.error(err);
      }
      setLoading(false); // จบ loading
    };

    fetchData(); // เรียก fetch data
  }, []);

  // 🔹 Filter results ตาม query
  const filteredResults = results.filter(
    (c) =>
      c.title.toLowerCase().startsWith(query.toLowerCase()) || // title match
      c.creator.toLowerCase().startsWith(query.toLowerCase()) // creator match
  );

  // 🔹 Handle share capsule
  const handleShare = (
    capsule: CapsuleType,
    ref: RefObject<HTMLButtonElement | null>
  ) => {
    setShareCapsule(capsule);
    setShareAnchor(ref);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-4 pt-20 flex flex-col items-center transition-colors">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100 transition-colors">
        Search Capsules
      </h1>

      {/* 🔹 Search Input */}
      <div className="w-full max-w-xl mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or creator..."
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-neutral-100 transition-colors"
        />
      </div>

      {/* 🔹 Loading Indicator */}
      {loading && (
        <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">
          Loading...
        </p>
      )}

      {/* 🔹 Capsule Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-6xl">
        {filteredResults.length > 0
          ? filteredResults.map((c) => {
              const shareRef = React.createRef<HTMLButtonElement | null>(); // ref สำหรับปุ่มแชร์
              return (
                <motion.div
                  key={c.id}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* 🔹 Capsule Card */}
                  <FeedCapsuleCard
                    capsule={{ ...c, bookmarked: isBookmarked(Number(c.id)) }} // เช็ค bookmarked จาก context
                    onBookmark={() => toggleBookmark(c)} // toggle bookmark
                    onShare={handleShare} // แชร์ capsule
                    shareRef={shareRef} // ref ของปุ่ม share
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

      {/* 🔹 Share Button Modal */}
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
