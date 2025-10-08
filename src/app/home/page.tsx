// src/app/home/page.tsx
"use client"; // บอก Next.js ว่านี่คือ Client Component ใช้งาน useState, useEffect ได้

import React, {
  useState,
  useEffect,
  RefObject,
  useRef,
  useCallback,
} from "react";
import FeedCapsuleCard from "@/components/Home/FeedCapsuleCard"; // การ์ด Capsule ใน Feed
import PopularMemories from "@/components/Home/PopularMemories"; // ส่วน Capsule ยอดนิยม
import ShareButton from "@/components/Home/ShareButton"; // ปุ่มแชร์
import CreateCapsuleForm from "@/components/CreateCapsuleForm"; // ฟอร์มสร้าง Capsule ใหม่
import Navbar from "@/components/Navbar"; // Navbar ด้านบน
import { CapsuleType, moodOptions } from "@/utils/capsuleUtils"; // Type และ Mood Options
import { posts } from "@/data/posts"; // ข้อมูลตัวอย่าง Posts
import { useCapsule } from "@/context/CapsuleContext"; // Context สำหรับแชร์ feed state, bookmark state

const ITEMS_PER_PAGE = 10; // จำนวน Capsule ต่อหน้า
const TOTAL_POSTS = posts.length; // จำนวนโพสต์ทั้งหมด

// สร้าง ALL_CAPSULES จาก posts สำหรับ Demo/Testing
const ALL_CAPSULES: CapsuleType[] = posts
  .map((title, i) => {
    const user = {
      name: { first: `User`, last: `${i + 1}` }, // สร้างชื่อ user
      picture: { large: `https://i.pravatar.cc/150?img=${i % 70}` }, // สุ่ม avatar
    };
    const mood = moodOptions[i % moodOptions.length]; // mood สลับ
    const visibility: "private" | "public" = i % 3 === 0 ? "private" : "public"; // ทุก 3 ตัวเป็น private

    return {
      id: String(i),
      title, // ชื่อจาก posts
      content: `This is a future note from User ${i + 1}.`,
      description: `A brief description for User ${i + 1}.`,
      creator: `${user.name.first} ${user.name.last}`,
      creatorAvatar: user.picture.large,
      imageSrc: `https://picsum.photos/seed/${i}/600/400`, // ภาพสุ่ม
      mood,
      targetDate: new Date(Date.now() + (i + 1) * 86400000), // วันที่อนาคต
      unlockAt: new Date(Date.now() + (i + 1) * 86400000), // วันที่ปลดล็อค
      views: Math.floor(Math.random() * 9999) + 100, // จำนวนวิวสุ่ม
      bookmarked: false, // bookmark เริ่ม false
      visibility,
      isPrivate: i % 3 === 0, // private ทุก 3 ตัว
      crossed: false, // ยังไม่ crossed
      postText: "", // ข้อความโพสต์ว่าง
    };
  })
  .reverse(); // สลับใหม่ให้โพสต์ล่าสุดอยู่บนสุด

// ฟังก์ชันจำลองการ fetch capsule แบบ paginated
const fetchPaginatedCapsules = (
  page: number
): Promise<{ data: CapsuleType[]; hasMore: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = (page - 1) * ITEMS_PER_PAGE; // เริ่ม index
      const endIndex = startIndex + ITEMS_PER_PAGE; // สิ้นสุด index
      const data = ALL_CAPSULES.slice(startIndex, endIndex); // slice data
      const hasMore = endIndex < TOTAL_POSTS; // มีหน้าถัดไปไหม
      resolve({ data, hasMore }); // return data + hasMore
    }, 500); // delay 500ms simulate fetch
  });
};

const HomePage: React.FC = () => {
  // ดึง state จาก CapsuleContext
  const { feedData, setFeedData, toggleBookmark, isBookmarked } = useCapsule();

  const [popularCapsules, setPopularCapsules] = useState<CapsuleType[]>([]); // Capsule ยอดนิยม
  const [shareCapsule, setShareCapsule] = useState<CapsuleType | null>(null); // Capsule ที่แชร์
  const [shareAnchor, setShareAnchor] =
    useState<RefObject<HTMLButtonElement | null> | null>(null); // ref สำหรับแชร์
  const [showCreateCapsuleForm, setShowCreateCapsuleForm] = useState(false); // แสดงฟอร์มสร้าง Capsule
  const [loading, setLoading] = useState(true); // loader state

  const [page, setPage] = useState(1); // page ปัจจุบัน
  const [hasMore, setHasMore] = useState(true); // มี Capsule เพิ่มไหม
  const loadMoreRef = useRef<HTMLDivElement>(null); // ref สำหรับ infinite scroll

  // โหลด Capsule เพิ่มเมื่อ scroll ถึง bottom
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return; // ถ้าโหลดอยู่หรือหมดแล้ว ให้ return
    setLoading(true);
    try {
      const { data: newCapsules, hasMore: newHasMore } =
        await fetchPaginatedCapsules(page); // fetch data
      setFeedData((prev) => [...prev, ...newCapsules]); // append capsule ใหม่
      setPage((prev) => prev + 1); // เพิ่ม page
      setHasMore(newHasMore); // update hasMore
    } catch (err) {
      console.error(err); // log error
    } finally {
      setLoading(false); // reset loading
    }
  }, [loading, hasMore, page, setFeedData]);

  // โหลด Capsule หน้าแรก + PopularCapsules
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const { data: initialCapsules, hasMore: initialHasMore } =
          await fetchPaginatedCapsules(1); // fetch หน้าแรก
        setFeedData(initialCapsules);
        setPage(2); // ตั้ง page ถัดไป
        setHasMore(initialHasMore); // update hasMore

        // กำหนด PopularCapsules Top 10 จากยอดวิว
        setPopularCapsules(
          [...ALL_CAPSULES].sort((a, b) => b.views - a.views).slice(0, 10)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [setFeedData]);

  // ตั้ง IntersectionObserver สำหรับ infinite scroll
  useEffect(() => {
    const ref = loadMoreRef.current;
    if (!ref || !hasMore) return; // ไม่มี ref หรือหมดแล้ว return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore(); // scroll ถึง div -> load more
      },
      { rootMargin: "500px 0px" } // เริ่มโหลดก่อน scroll ถึง 500px
    );
    observer.observe(ref); // เริ่ม observe
    return () => {
      if (ref) observer.unobserve(ref); // cleanup
    };
  }, [hasMore, loadMore]);

  // ฟังก์ชันแชร์ Capsule จาก Feed
  const handleShareFeed = (
    capsule: CapsuleType,
    ref: RefObject<HTMLButtonElement | null>
  ) => {
    setShareCapsule(capsule); // กำหนด capsule ที่แชร์
    setShareAnchor(ref); // กำหนด ref ปุ่ม
  };

  // ฟังก์ชันแชร์ Capsule จาก Popular
  const handleSharePopular = (capsule: CapsuleType) => {
    const dummyRef = React.createRef<HTMLButtonElement | null>(); // สร้าง dummy ref
    setShareCapsule(capsule);
    setShareAnchor(dummyRef);
  };

  // ฟังก์ชันสร้าง Capsule ใหม่
  const handleCreateCapsule = (newCapsule: CapsuleType) => {
    const moodWithColor = {
      ...newCapsule.mood,
      color:
        newCapsule.mood.color ||
        moodOptions.find((m) => m.name === newCapsule.mood.name)?.color ||
        "text-gray-600 bg-gray-100", // ถ้าไม่มี color ให้ default
    };
    setFeedData((prev) => [{ ...newCapsule, mood: moodWithColor }, ...prev]); // prepend capsule ใหม่
    setShowCreateCapsuleForm(false); // ปิดฟอร์ม
  };

  return (
    <div className="min-h-[80vh] bg-white dark:bg-neutral-950 flex flex-col justify-center pt-16 px-4 pb-8 relative">
      {/* Navbar */}
      <Navbar onOpenCreateCapsule={() => setShowCreateCapsuleForm(true)} />
      
      {/* ฟอร์มสร้าง Capsule */}
      {showCreateCapsuleForm && (
        <CreateCapsuleForm
          onCreate={handleCreateCapsule}
          onClose={() => setShowCreateCapsuleForm(false)}
        />
      )}

      {/* Popular Memories */}
      <div className="w-full flex justify-center mt-4">
        <div className="w-full max-w-5xl">
          <PopularMemories
            popularCapsules={popularCapsules.map((c) => ({
              ...c,
              bookmarked: isBookmarked(Number(c.id)), // ตรวจสอบ bookmark
            }))}
            onBookmark={toggleBookmark} // bookmark callback
            onShare={handleSharePopular} // share callback
          />
        </div>
      </div>

      {/* Feed Capsules */}
      <section className="w-full mt-4 flex justify-center">
        <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
          {/* Skeleton Loader ขณะโหลด */}
          {loading &&
            feedData.length === 0 &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 w-full rounded-xl bg-gray-200 dark:bg-neutral-700 animate-pulse"
              />
            ))}

          {/* Render Feed Capsules */}
          {feedData.map((c) => {
            const shareRef = React.createRef<HTMLButtonElement | null>();
            return (
              <FeedCapsuleCard
                key={c.id}
                capsule={{ ...c, bookmarked: isBookmarked(Number(c.id)) }}
                onBookmark={() => toggleBookmark(c)}
                size="large"
                onShare={handleShareFeed}
                shareRef={shareRef}
              />
            );
          })}

          {/* Loader สำหรับ Infinite Scroll */}
          {hasMore && (
            <div ref={loadMoreRef} className="text-center py-8">
              {loading ? (
                <div className="animate-pulse text-gray-500">Loading...</div>
              ) : (
                <div className="text-gray-400">Scroll down to load more.</div>
              )}
            </div>
          )}

          {/* เมื่อโหลดหมดแล้ว */}
          {!hasMore && (
            <div className="text-center py-8 text-gray-500">
              You have seen all the capsules. T=T
            </div>
          )}
        </div>
      </section>

      {/* Share Button */}
      {shareCapsule && shareAnchor && (
        <ShareButton
          capsuleId={Number(shareCapsule.id)}
          shareRef={shareAnchor as React.RefObject<HTMLButtonElement>} // cast ให้ตรง type
        />
      )}
    </div>
  );
};

export default HomePage;
