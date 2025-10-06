// src/utils/capsuleUtils.ts

// ตัวเลือกอารมณ์สำหรับ Capsule
export const moodOptions = [
  { name: "Happy", emoji: "😄", color: "text-yellow-600 bg-yellow-100" },
  { name: "Sad", emoji: "😢", color: "text-blue-600 bg-blue-100" },
  { name: "Excited", emoji: "🤩", color: "text-red-600 bg-red-100" },
  { name: "Calm", emoji: "😌", color: "text-green-600 bg-green-100" },
  { name: "Angry", emoji: "😡", color: "text-rose-600 bg-rose-100" },
  { name: "Tired", emoji: "😴", color: "text-gray-600 bg-gray-100" },
];

// โครงสร้าง Capsule — ใช้กลางทั้งระบบ
export interface CapsuleType {
  id: number;
  title: string;
  creator: string;
  creatorAvatar: string;
  imageSrc?: string;
  mood: typeof moodOptions[number]; // ต้องมี name, emoji, color ครบ
  targetDate: Date;
  views: number;
  bookmarked: boolean;
  content?: string;   // ข้อความหลักของ Capsule
  postText?: string;  // ข้อความบันทึกแรก
  isPrivate?: boolean; // 💥 เพิ่ม field นี้ให้รองรับฟอร์มสร้าง Capsule
}

// ฟังก์ชัน format views
export const formatViews = (views: number) =>
  views >= 1000 ? (views / 1000).toFixed(1) + "k" : views.toString();

// ฟังก์ชันช่วยดึง postText แบบบันทึกแรก
import { posts } from "@/data/posts";
export const getFirstPostText = (capsule: CapsuleType): string => {
  return capsule.postText || posts[0];
};
