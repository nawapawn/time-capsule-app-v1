"use client";
import React, {
  useState,
  useEffect,
  RefObject,
  useRef,
  useCallback,
} from "react";
import FeedCapsuleCard from "@/components/Home/FeedCapsuleCard";
import PopularMemories from "@/components/Home/PopularMemories";
import ShareButton from "@/components/Home/ShareButton";
import CreateCapsuleForm from "@/components/CreateCapsuleForm";
import Navbar from "@/components/Navbar";
import { CapsuleType, moodOptions } from "@/utils/capsuleUtils";
import { posts } from "@/data/posts";
import { useCapsule } from "@/context/CapsuleContext";

// === Pagination constants ===
const ITEMS_PER_PAGE = 10;
const TOTAL_POSTS = posts.length;

// === Simulated capsule dataset ===
const ALL_CAPSULES: CapsuleType[] = posts
  .map((title, i) => {
    const user = {
      name: { first: `User`, last: `${i + 1}` },
      picture: { large: `https://i.pravatar.cc/150?img=${i % 70}` },
    };

    // ✅ mood ต้องมี color เสมอ
    const mood = moodOptions[i % moodOptions.length];

    return {
      id: i,
      title,
      creator: `${user.name.first} ${user.name.last}`,
      creatorAvatar: user.picture.large,
      imageSrc: `https://picsum.photos/seed/${i}/600/400`,
      mood, // { name, emoji, color }
      targetDate: new Date(Date.now() + (i + 1) * 86400000),
      views: Math.floor(Math.random() * 9999) + 100,
      bookmarked: false,
    };
  })
  .reverse();

// === Mock API for pagination ===
const fetchPaginatedCapsules = (
  page: number
): Promise<{ data: CapsuleType[]; hasMore: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const data = ALL_CAPSULES.slice(startIndex, endIndex);
      const hasMore = endIndex < TOTAL_POSTS;
      resolve({ data, hasMore });
    }, 500);
  });
};

const HomePage: React.FC = () => {
  const { feedData, setFeedData, toggleBookmark, isBookmarked } = useCapsule();
  const [popularCapsules, setPopularCapsules] = useState<CapsuleType[]>([]);
  const [shareCapsule, setShareCapsule] = useState<CapsuleType | null>(null);
  const [shareAnchor, setShareAnchor] =
    useState<RefObject<HTMLButtonElement> | null>(null);
  const [showCreateCapsuleForm, setShowCreateCapsuleForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Ref for observer
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // === Load more function ===
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { data: newCapsules, hasMore: newHasMore } =
        await fetchPaginatedCapsules(page);
      setFeedData((prevItems) => [...prevItems, ...newCapsules]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(newHasMore);
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, setFeedData]);

  // === Load initial capsules ===
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const { data: initialCapsules, hasMore: initialHasMore } =
          await fetchPaginatedCapsules(1);
        setFeedData(initialCapsules);
        setPage(2);
        setHasMore(initialHasMore);

        setPopularCapsules(
          [...ALL_CAPSULES].sort((a, b) => b.views - a.views).slice(0, 10)
        );
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [setFeedData]);

  // === IntersectionObserver for infinite scroll ===
  useEffect(() => {
    const ref = loadMoreRef.current;
    if (!ref || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "500px 0px" }
    );

    observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [hasMore, loadMore]);

  // === Share handler ===
  const handleShare = (
    capsule: CapsuleType,
    ref: RefObject<HTMLButtonElement>
  ) => {
    setShareCapsule(capsule);
    setShareAnchor(ref);
  };

  // ✅ Ensure type consistency: CapsuleType from utils only
  const handleCreateCapsule = (newCapsule: CapsuleType) => {
    // ถ้า mood ที่ส่งเข้ามายังไม่มี color -> ใส่ค่า default
    const moodWithColor = {
      ...newCapsule.mood,
      color: newCapsule.mood.color ?? "#cccccc",
    };

    const fixedCapsule: CapsuleType = {
      ...newCapsule,
      mood: moodWithColor,
    };

    setFeedData((prev) => [fixedCapsule, ...prev]);
    setShowCreateCapsuleForm(false);
  };

  return (
    <div className="min-h-[80vh] bg-white flex flex-col justify-center pt-16 px-4 pb-8 relative">
      <Navbar onOpenCreateCapsule={() => setShowCreateCapsuleForm(true)} />

      {showCreateCapsuleForm && (
        <CreateCapsuleForm
          // 👇 ensure prop type matches capsuleUtils.CapsuleType
          onCreate={handleCreateCapsule}
          onClose={() => setShowCreateCapsuleForm(false)}
        />
      )}

      {/* === Popular section === */}
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

      {/* === Feed section === */}
      <section className="w-full mt-4 flex justify-center">
        <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
          {loading &&
            feedData.length === 0 &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-64 w-full rounded-xl bg-gray-200 dark:bg-neutral-700 animate-pulse"
              />
            ))}

          {feedData.map((c) => {
            const shareRef = React.createRef<HTMLButtonElement>();
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

          {hasMore && (
            <div ref={loadMoreRef} className="text-center py-8">
              {loading ? (
                <div className="animate-pulse text-gray-500">กำลังโหลด...</div>
              ) : (
                <div className="text-gray-400">เลื่อนลงเพื่อโหลดเพิ่ม</div>
              )}
            </div>
          )}

          {!hasMore && (
            <div className="text-center py-8 text-gray-500">
              คุณได้ดูแคปซูลทั้งหมดแล้ว 🎉
            </div>
          )}
        </div>
      </section>

      {shareCapsule && shareAnchor && (
        <ShareButton capsuleId={shareCapsule.id} shareRef={shareAnchor} />
      )}
    </div>
  );
};

export default HomePage;
