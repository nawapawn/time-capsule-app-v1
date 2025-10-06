// src/store/profileStore.ts

import { create } from 'zustand';

// 1. Define the Profile Type (ถ้าไม่มีใน src/types ให้สร้างขึ้นมา)
export type UserProfile = {
  name: string;
  email: string;
  tagline: string;
  avatarUrl: string;
};

// 2. Define the Store State and Actions
interface ProfileState {
  profile: UserProfile;
  // Action: ฟังก์ชันสำหรับอัปเดตข้อมูลโปรไฟล์ทั้งหมด
  updateProfile: (newProfile: UserProfile) => void;
}

// 3. Create the Store with initial mock data
export const useProfileStore = create<ProfileState>((set) => ({
  profile: {
    name: "Astronaut_393", // ชื่อเริ่มต้น
    email: "astro@example.com",
    tagline: "Exploring memories through time & space",
    avatarUrl: "", 
  },
  // Implement the updateProfile action
  updateProfile: (newProfile) => set({ profile: newProfile }),
}));