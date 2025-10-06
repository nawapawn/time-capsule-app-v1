// src/types/index.ts
export const moodOptions = [
  { name: "Happy", emoji: "😄", color: "text-yellow-600 bg-yellow-100" },
  { name: "Sad", emoji: "😢", color: "text-blue-600 bg-blue-100" },
  { name: "Excited", emoji: "🤩", color: "text-red-600 bg-red-100" },
  { name: "Calm", emoji: "😌", color: "text-green-600 bg-green-100" },
  { name: "Angry", emoji: "😡", color: "text-rose-600 bg-rose-100" },
  { name: "Tired", emoji: "😴", color: "text-gray-600 bg-gray-100" },
];
/**
 * Defines the structure for a Time Capsule item.
 */
export type Capsule = {
  id: string;
    title: string;
    content: string; // ข้อความหลักของ Capsule
    description?: string; // ถ้ามีรายละเอียดเพิ่มเติม
    creator: string;
    creatorAvatar: string;
    imageSrc?: string;
    mood: (typeof moodOptions)[number]; // ต้องมี name, emoji, color ครบ
    targetDate: Date;
    unlockAt?: Date; // รองรับ field ที่ ProfilePage ต้องการ
    visibility?: "Private" | "Public"; // เพิ่ม field visibility
    views: number;
    bookmarked: boolean;
    isPrivate?: boolean; // 💥 สำหรับฟอร์มสร้าง Capsule
    crossed?: boolean; // ใช้ใน capsuleStore
    postText?: string; // ข้อความบันทึกแรก
  }