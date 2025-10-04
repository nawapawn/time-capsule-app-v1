// src/utils/capsuleUtils.ts
export const moodOptions = [
  { name: "Happy", emoji: "😄", color: "text-yellow-600 bg-yellow-100" },
  { name: "Sad", emoji: "😢", color: "text-blue-600 bg-blue-100" },
  { name: "Excited", emoji: "🤩", color: "text-red-600 bg-red-100" },
  { name: "Calm", emoji: "😌", color: "text-green-600 bg-green-100" },
  { name: "Angry", emoji: "😡", color: "text-rose-600 bg-rose-100" },
  { name: "Tired", emoji: "😴", color: "text-gray-600 bg-gray-100" },
];

export interface CapsuleType {
  id: number;
  title: string;
  creator: string;
  creatorAvatar: string;
  imageSrc?: string;
  mood: typeof moodOptions[number];
  targetDate: Date;
  views: number;
  bookmarked: boolean;
  content?: string;
}

export const formatViews = (views: number) =>
  views >= 1000 ? (views / 1000).toFixed(1) + "k" : views.toString();
