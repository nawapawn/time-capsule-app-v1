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

export const popularMemoryTitles = [
  "ปีใหม่จะมีแฟน 😏",
  "16 นี้แม่ถูกหวย 💰",
  "โปรเจคจะเสร็จเมื่อไหร่ 🤯",
  "ปีหน้าจะลดน้ำหนัก 🏋️‍♀️",
  "จะซื้อบั้มนี้ให้ได้เลย 🎶",
  "วันนี้ตื่นสายอีกแล้ว 😴",
  "แมวจะหยุดขโมยขนมไหม 🐱",
  "กาแฟหมดก่อนเที่ยง ☕",
  "เงินเดือนพอใช้ไหมนะ 💸",
  "สุดสัปดาห์นี้ไม่ง่วงนะ 🛌",
];

export const publicFeedTitles = Array.from(
  { length: 20 },
  (_, i) => `Public Memory Story #${i + 1}`
);
export const followingFeedTitles = Array.from(
  { length: 20 },
  (_, i) => `Friend Memory Story #${i + 1}`
);

export const generateCapsulesFromTitles = (
  titles: string[],
  following = false
): CapsuleType[] =>
  titles.map((title, i) => {
    const mood = moodOptions[i % moodOptions.length];
    return {
      id: i + 1,
      title,
      content: `นี่คือเนื้อหาของ "${title}"`,
      creator: following ? `friend_${i + 1}` : `user_${i + 1}`,
      creatorAvatar: `/avatar_${(i % 5) + 1}.png`,
      imageSrc: `/capsule_${(i % 5) + 1}.png`,
      mood,
      targetDate: new Date(Date.now() + (i + 1) * 86400000),
      views: Math.floor(Math.random() * 9999) + 100,
      bookmarked: false,
    };
  });

export const formatViews = (views: number) =>
  views >= 1000 ? (views / 1000).toFixed(1) + "k" : views.toString();
