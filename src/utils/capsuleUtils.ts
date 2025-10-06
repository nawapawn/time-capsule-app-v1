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
  content: string; // ข้อความหลักของ Capsule
  description?: string; // ถ้ามีรายละเอียดเพิ่มเติม
  creator: string;
  creatorAvatar: string;
  imageSrc?: string;
  mood: (typeof moodOptions)[number]; // ต้องมี name, emoji, color ครบ
  targetDate: Date;
  unlockAt?: Date; // รองรับ field ที่ ProfilePage ต้องการ
  visibility?: "private" | "public"; // เพิ่ม field visibility
  views: number;
  bookmarked: boolean;
  isPrivate?: boolean; // 💥 สำหรับฟอร์มสร้าง Capsule
  crossed?: boolean; // ใช้ใน capsuleStore
  postText?: string; // ข้อความบันทึกแรก
}

// ฟังก์ชัน format views
export const formatViews = (views: number) =>
  views >= 1000 ? (views / 1000).toFixed(1) + "k" : views.toString();

// ฟังก์ชันช่วยดึง postText แบบบันทึกแรก
import { posts } from "@/data/posts";
export const getFirstPostText = (capsule: CapsuleType): string => {
  return capsule.postText || posts[0] || "";
};
