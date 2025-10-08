// src/lib/mockData.ts
import { Capsule } from "@/types";

// เก็บเวลาปัจจุบันและคำนวณเวลา 1 ปีเป็นมิลลิวินาที
const now = Date.now();
const oneYear = 365 * 24 * 60 * 60 * 1000;

// ตัวอย่างข้อมูล Capsule สำหรับ mock หรือทดสอบ
export const mockCapsules: Capsule[] = [
  {
    id: "1", // รหัสเอกลักษณ์ของ Capsule
    title: "Relic from the Past", // ชื่อ Capsule
    unlockAt: new Date(now - oneYear), // วันที่ Capsule ถูกปลดล็อก (ผ่านมาแล้ว 1 ปี)
    description: "A fun reminder from six months ago. Was it worth the wait?", // คำอธิบายสั้น ๆ
    content: "The past is a foreign country; they do things differently there.", // เนื้อหาของ Capsule
    visibility: "private", // การเข้าถึง: private = เฉพาะเจ้าของ
    creator: "Alice", // ผู้สร้าง Capsule
    creatorAvatar: "https://i.pravatar.cc/150?img=1", // รูปโปรไฟล์ผู้สร้าง
    mood: { name: "Happy", emoji: "😄", color: "text-yellow-500" }, // อารมณ์ของ Capsule
    targetDate: new Date(now - 6 * 30 * 24 * 60 * 60 * 1000), // วันที่เป้าหมายที่ Capsule อ้างอิงถึง (6 เดือนก่อน)
    views: 123, // จำนวนการเข้าชม
    bookmarked: false, // ถูกบุ๊คมาร์คหรือไม่
  },
  {
    id: "2",
    title: "Autumn Reflection",
    unlockAt: new Date(now + 30 * 24 * 60 * 60 * 1000), // ปลดล็อกอีก 30 วันข้างหน้า
    description: "What were my goals for this fall season?",
    content: "Goal 1: Learn Next.js. Goal 2: Build a stunning profile page.",
    visibility: "public", // สาธารณะ
    creator: "Bob",
    creatorAvatar: "https://i.pravatar.cc/150?img=2",
    mood: { name: "Calm", emoji: "😌", color: "text-blue-500" },
    targetDate: new Date(now + 30 * 24 * 60 * 60 * 1000), // วันที่เป้าหมายตรงกับวันปลดล็อก
    views: 456,
    bookmarked: false,
  },
  {
    id: "3",
    title: "New Year Protocol",
    unlockAt: new Date(new Date().getFullYear() + 1, 0, 1), // ปลดล็อกวันที่ 1 มกราคมปีหน้า
    description: "A message saved to kick off the next year.",
    content: "Happy New Year, Future Me! Don't forget your resolutions.",
    visibility: "private",
    creator: "Charlie",
    creatorAvatar: "https://i.pravatar.cc/150?img=3",
    mood: { name: "Tired", emoji: "😴", color: "text-red-500" },
    targetDate: new Date(new Date().getFullYear() + 1, 0, 1), // วันที่เป้าหมายตรงกับวันปลดล็อกปีใหม่
    views: 789,
    bookmarked: false,
  },
  {
    id: "4",
    title: "Mid-Year Checkpoint",
    unlockAt: new Date(now + 180 * 24 * 60 * 60 * 1000), // ปลดล็อกอีก 180 วันข้างหน้า
    description: "Check on progress toward major goals set earlier this year.",
    content: "Is the Starship operational? Report back!",
    visibility: "public",
    creator: "Dana",
    creatorAvatar: "https://i.pravatar.cc/150?img=4",
    mood: { name: "Happy", emoji: "😄", color: "text-green-500" },
    targetDate: new Date(now + 180 * 24 * 60 * 60 * 1000), // เป้าหมายตรงกับวันปลดล็อกกลางปี
    views: 234,
    bookmarked: false,
  },
  {
    id: "5",
    title: "The Distant Horizon",
    unlockAt: new Date(now + 2 * oneYear), // ปลดล็อกอีก 2 ปีข้างหน้า
    description: "A time capsule to open exactly two years from now.",
    content: "If you're reading this, humanity is safe. Probably.",
    visibility: undefined, // ถ้า undefined อาจใช้เป็น default visibility
    creator: "Eve",
    creatorAvatar: "https://i.pravatar.cc/150?img=5",
    mood: { name: "Angry", emoji: "😡", color: "text-purple-500" },
    targetDate: new Date(now + 2 * oneYear), // เป้าหมายตรงกับวันปลดล็อกอีก 2 ปี
    views: 567,
    bookmarked: false,
  },
];
