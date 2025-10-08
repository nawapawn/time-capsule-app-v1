// src/store/capsuleStore.ts
"use client";

import { create } from "zustand"; // import ฟังก์ชันสร้าง store ของ Zustand
import { persist } from "zustand/middleware"; // middleware สำหรับเก็บ state ใน localStorage
import { CapsuleType } from "@/utils/capsuleUtils"; // import type ของ Capsule

// กำหนด interface สำหรับ store
interface CapsuleStore {
  capsules: CapsuleType[]; // array เก็บ Capsule ทั้งหมด
  addCapsule: (capsule: CapsuleType) => void; // เพิ่ม Capsule ใหม่
  removeCapsule: (id: string) => void; // ลบ Capsule ตาม id
  toggleBookmark: (id: string) => void; // สลับสถานะ bookmarked
  togglePrivacy: (id: string) => void; // สลับสถานะ isPrivate
  toggleCrossed: (id: string) => void; // สลับสถานะ crossed (ทำเครื่องหมายแล้ว)
  clearAll?: () => void; // ล้าง Capsule ทั้งหมด (optional)
}

// สร้าง Zustand store พร้อม persist (เก็บ state ใน localStorage)
export const useCapsuleStore = create<CapsuleStore>()(
  persist(
    (set) => ({
      capsules: [], // ค่าเริ่มต้นเป็น array ว่าง

      // เพิ่ม Capsule ใหม่ไว้ด้านบนของ array
      addCapsule: (capsule) =>
        set((state) => ({ capsules: [capsule, ...state.capsules] })),

      // ลบ Capsule ตาม id
      removeCapsule: (id) =>
        set((state) => ({
          capsules: state.capsules.filter((c) => c.id !== id),
        })),

      // สลับสถานะ bookmarked ของ Capsule ตาม id
      toggleBookmark: (id) =>
        set((state) => ({
          capsules: state.capsules.map((c) =>
            c.id === id ? { ...c, bookmarked: !c.bookmarked } : c
          ),
        })),

      // สลับสถานะ isPrivate ของ Capsule ตาม id
      togglePrivacy: (id) =>
        set((state) => ({
          capsules: state.capsules.map((c) =>
            c.id === id ? { ...c, isPrivate: !c.isPrivate } : c
          ),
        })),

      // สลับสถานะ crossed ของ Capsule ตาม id
      toggleCrossed: (id) =>
        set((state) => ({
          capsules: state.capsules.map((c) =>
            c.id === id ? { ...c, crossed: !c.crossed } : c
          ),
        })),

      // ล้าง Capsule ทั้งหมด
      clearAll: () => set({ capsules: [] }),
    }),

    // ตั้งชื่อ key สำหรับ persist ใน localStorage
    { name: "capsules" }
  )
);
