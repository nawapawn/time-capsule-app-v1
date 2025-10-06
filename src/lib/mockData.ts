// src/lib/mockData.ts
import { Capsule } from "@/types";

// ใช้ Date.now() เป็นจุดอ้างอิง
const now = Date.now();
const oneYear = 365 * 24 * 60 * 60 * 1000;

export const mockCapsules: Capsule[] = [
  {
    id: "1",
    title: "Relic from the Past",
    // Unlocked: 1 ปีในอดีต
    unlockAt: new Date(now - oneYear).toISOString(), 
    description: "A fun reminder from six months ago. Was it worth the wait?",
    content: "The past is a foreign country; they do things differently there.",
    visibility: "Private"
  },
  {
    id: "2",
    title: "Autumn Reflection",
    // Locked: 1 เดือนในอนาคต
    unlockAt: new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString(), 
    description: "What were my goals for this fall season?",
    content: "Goal 1: Learn Next.js. Goal 2: Build a stunning profile page.",
    visibility: "Public"
  },
  {
    id: "3",
    title: "New Year Protocol",
    // Locked: 1 ม.ค. ปีหน้า
    unlockAt: new Date(new Date().getFullYear() + 1, 0, 1).toISOString(), 
    description: "A message saved to kick off the next year.",
    content: "Happy New Year, Future Me! Don't forget your resolutions.",
    visibility: "Private"
  },
  {
    id: "4",
    title: "Mid-Year Checkpoint",
    // Locked: 6 เดือนในอนาคต
    unlockAt: new Date(now + 180 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Check on progress toward major goals set earlier this year.",
    content: "Is the Starship operational? Report back!",
    visibility: "Public"
  },
  {
    id: "5",
    title: "The Distant Horizon",
    // Locked: 2 ปีในอนาคต
    unlockAt: new Date(now + 2 * oneYear).toISOString(), 
    description: "A time capsule to open exactly two years from now.",
    content: "If you're reading this, humanity is safe. Probably.",
    visibility: "Unlisted"
  },
];