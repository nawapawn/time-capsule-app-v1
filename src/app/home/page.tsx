// src/app/hame/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Send, Heart, MessageCircle, Share2 } from "lucide-react";

// =============================
// MOCK DATA
// =============================
const MOCK_POSTS = Array.from({ length: 10 }).map((_, index) => ({
  id: index,
  username: `user_${index < 9 ? "0" : ""}${index + 1}`,
  avatarSrc: `https://i.pravatar.cc/40?img=${index + 1}`,
  timeAgo: `${index * 2 + 1} hours ago`,
  content:
    index % 3 === 0
      ? "What a great day for coding! Sometimes all you need is a single, perfectly functioning component to feel like you can conquer the world. 💻✨"
      : index % 3 === 1
      ? "Just finished reading 'The Martian'. Absolutely brilliant blend of science and survival narrative. Highly recommend it if you haven't picked it up yet! #bookrecommendation"
      : "The best advice I ever got was to 'start small'. Don't try to build the whole app at once, focus on the core feature and iterate. It really lowers the barrier to entry.",
  likes: 15 + index * 5,
  replies: 2 + index,
}));

const MOCK_USER_SESSION_KEY = "mockAppUserId";

// =============================
// CHILD COMPONENTS
// =============================

// --- Create a new post ---
const CreatePostCard = () => {
  const [postContent, setPostContent] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim()) {
      console.log("New post submitted:", postContent);
      setPostContent("");
      // TODO: Replace with real API call
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
        Create a new Thread
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's on your mind? Start a thread..."
          rows={3}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-colors"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!postContent.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send size={18} />
            <span>Post</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Single Post Card ---
const PostCard = ({ post }: { post: (typeof MOCK_POSTS)[0] }) => {
  const { username, avatarSrc, timeAgo, content, likes, replies } = post;

  const IconWithCount = ({
    Icon,
    count,
    colorClass,
  }: {
    Icon: React.ElementType;
    count: number;
    colorClass: string;
  }) => (
    <button
      className={`flex items-center space-x-1 p-2 rounded-full transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-500 dark:text-gray-400 ${colorClass}`}
    >
      <Icon size={18} />
      <span className="font-medium">{count > 0 ? count : ""}</span>
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
      {/* User Info + Time */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <Image
            src={avatarSrc}
            alt={`${username}'s Avatar`}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-blue-500/50 dark:ring-blue-400/50"
          />
          <span className="font-bold text-gray-900 dark:text-white hover:underline cursor-pointer">
            {username}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {timeAgo}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 pl-12 text-base">
        {content}
      </p>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 mb-2"></div>

      {/* Actions */}
      <div className="flex justify-start space-x-4 pl-10">
        <IconWithCount
          Icon={Heart}
          count={likes}
          colorClass="hover:text-red-500"
        />
        <IconWithCount
          Icon={MessageCircle}
          count={replies}
          colorClass="hover:text-blue-500"
        />
        <IconWithCount
          Icon={Share2}
          count={0}
          colorClass="hover:text-green-500"
        />
      </div>
    </div>
  );
};

// =============================
// MAIN PAGE
// =============================
const HomePage = () => {
  const router = useRouter();

  // Check authentication
  React.useEffect(() => {
    const storedUserId = localStorage.getItem(MOCK_USER_SESSION_KEY);
    if (!storedUserId) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-3xl mx-auto p-4 md:p-8">
        {/* Post Creation */}
        <CreatePostCard />

        {/* Feed */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Home Feed
          </h2>
          {MOCK_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* End of feed message */}
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here&apos;s your personalized feed. Collaborate, explore, and share.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
