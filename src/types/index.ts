// src/types/index.ts

// ----- กำหนดตัวเลือก Mood -----
// แต่ละ Mood มีชื่อ, emoji, และสี background+text
export const moodOptions = [
  { name: "Happy", emoji: "😄", color: "text-yellow-600 bg-yellow-100" },
  { name: "Sad", emoji: "😢", color: "text-blue-600 bg-blue-100" },
  { name: "Excited", emoji: "🤩", color: "text-red-600 bg-red-100" },
  { name: "Calm", emoji: "😌", color: "text-green-600 bg-green-100" },
  { name: "Angry", emoji: "😡", color: "text-rose-600 bg-rose-100" },
  { name: "Tired", emoji: "😴", color: "text-gray-600 bg-gray-100" },
];

/**
 * Capsule type: โครงสร้างข้อมูลสำหรับ Time Capsule หนึ่งอัน
 */
export type Capsule = {
  id: string;               // รหัสเฉพาะของ Capsule
  title: string;            // ชื่อ Capsule
  content: string;          // ข้อความหลักของ Capsule
  description?: string;     // รายละเอียดเสริม (ถ้ามี)
  creator: string;          // ชื่อผู้สร้าง
  creatorAvatar: string;    // URL ของ avatar ผู้สร้าง
  imageSrc?: string;        // รูปประกอบ Capsule (optional)
  mood: (typeof moodOptions)[number]; // Mood ของ Capsule ต้องเป็นหนึ่งใน moodOptions
  targetDate: Date;         // วันที่เป้าหมาย หรือวันที่ตั้งใจให้ Capsule เกิด/เปิด
  unlockAt?: Date;          // วันที่ Capsule จะถูกปลดล็อก
  visibility?: "private" | "public"; // ความเป็นส่วนตัวของ Capsule
  views: number;            // จำนวนครั้งที่ Capsule ถูกดู
  bookmarked: boolean;      // ว่าผู้ใช้บันทึก Capsule นี้หรือไม่
  isPrivate?: boolean;      // ใช้ในฟอร์มสร้าง Capsule
  crossed?: boolean;        // สถานะขีดเส้นหรือทำเครื่องหมาย Capsule (capsuleStore)
  postText?: string;        // ข้อความบันทึกแรกของ Capsule
};
