// src/utils/capsuleUtils.ts

// ----- ตัวเลือกอารมณ์สำหรับ Capsule -----
// ใช้เลือก mood ให้กับแต่ละ Capsule
export const moodOptions = [
  { name: "Happy", emoji: "😄", color: "text-yellow-600 bg-yellow-100" },
  { name: "Sad", emoji: "😢", color: "text-blue-600 bg-blue-100" },
  { name: "Excited", emoji: "🤩", color: "text-red-600 bg-red-100" },
  { name: "Calm", emoji: "😌", color: "text-green-600 bg-green-100" },
  { name: "Angry", emoji: "😡", color: "text-rose-600 bg-rose-100" },
  { name: "Tired", emoji: "😴", color: "text-gray-600 bg-gray-100" },
];

// ----- โครงสร้าง CapsuleType -----
// ใช้เป็น type กลางสำหรับ Capsule ทั้งระบบ
export interface CapsuleType {
  id: string;                    // รหัสเฉพาะ
  title: string;                 // ชื่อ Capsule
  content: string;               // ข้อความหลักของ Capsule
  description?: string;          // รายละเอียดเสริม
  creator: string;               // ชื่อผู้สร้าง
  creatorAvatar: string;         // URL ของ avatar ผู้สร้าง
  imageSrc?: string;             // รูปประกอบ Capsule (optional)
  mood: (typeof moodOptions)[number]; // Mood ของ Capsule ต้องเลือกจาก moodOptions
  targetDate: Date;              // วันที่ตั้งเป้าหมาย Capsule
  unlockAt?: Date;               // วันที่ Capsule จะปลดล็อก
  visibility?: "private" | "public"; // ความเป็นส่วนตัว
  views: number;                 // จำนวนครั้งที่ Capsule ถูกดู
  bookmarked: boolean;           // ถูก bookmark หรือไม่
  isPrivate?: boolean;           // สำหรับฟอร์มสร้าง Capsule
  crossed?: boolean;             // สถานะขีดเส้น (capsuleStore)
  postText?: string;             // ข้อความบันทึกแรกของ Capsule
}

// ----- ฟังก์ชันช่วย format views -----
// เช่น 1200 -> "1.2k"
export const formatViews = (views: number) =>
  views >= 1000 ? (views / 1000).toFixed(1) + "k" : views.toString();

// ----- ฟังก์ชันช่วยดึง postText แบบบันทึกแรก -----
// ถ้า Capsule ไม่มี postText ให้ fallback เป็น posts[0]
import { posts } from "@/data/posts";
export const getFirstPostText = (capsule: CapsuleType): string => {
  return capsule.postText || posts[0] || "";
};
