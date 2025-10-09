// store สำหรับจัดการข้อมูลโปรไฟล์ผู้ใช้ด้วย Zustand + persist
import { create } from "zustand";
import { persist } from "zustand/middleware";

// กำหนด type ของโปรไฟล์ผู้ใช้
export type UserProfile = {
  name: string;      // ชื่อผู้ใช้
  email: string;     // อีเมลผู้ใช้
  tagline: string;   // ประโยคสั้น ๆ แสดงตัวตน
  avatarUrl: string; // URL ของรูปโปรไฟล์
};

// กำหนด interface ของ state
interface ProfileState {
  profile: UserProfile;                               // ข้อมูลโปรไฟล์ปัจจุบัน
  updateProfile: (newProfile: Partial<UserProfile>) => void; // ฟังก์ชันอัปเดตบางส่วนของโปรไฟล์
  resetProfile: () => void;                           // ฟังก์ชันรีเซ็ตโปรไฟล์เป็นค่าเริ่มต้น
}

// ค่าเริ่มต้นของโปรไฟล์
const DEFAULT_PROFILE: UserProfile = {
  name: "Astronaut",
  email: "astro@example.com",
  tagline: "Exploring memories through time & space",
  avatarUrl: "",
};

// สร้าง store
export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE, // ค่าเริ่มต้น

      // ฟังก์ชันอัปเดต profile
      updateProfile: (newProfile) =>
        set((state) => ({
          profile: { ...state.profile, ...newProfile }, // merge ค่าใหม่กับค่าปัจจุบัน
        })),

      // ฟังก์ชันรีเซ็ต profile เป็น default
      resetProfile: () => set({ profile: DEFAULT_PROFILE }),
    }),
    {
      name: "profile-storage", // key สำหรับ persist ใน localStorage
      storage: {
        // กำหนดวิธีการ get, set, remove item
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
