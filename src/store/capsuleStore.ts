// src/store/capsuleStore.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CapsuleType } from "@/utils/capsuleUtils";

interface CapsuleStore {
  capsules: CapsuleType[];
  addCapsule: (capsule: CapsuleType) => void;
  removeCapsule: (id: string) => void;
  toggleBookmark: (id: string) => void;
  togglePrivacy: (id: string) => void;
  toggleCrossed: (id: string) => void;
  clearAll?: () => void;
}

export const useCapsuleStore = create<CapsuleStore>()(
  persist(
    (set) => ({
      capsules: [],
      addCapsule: (capsule) =>
        set((state) => ({ capsules: [capsule, ...state.capsules] })),
      removeCapsule: (id) =>
        set((state) => ({ capsules: state.capsules.filter((c) => c.id !== id) })),
      toggleBookmark: (id) =>
        set((state) => ({
          capsules: state.capsules.map((c) =>
            c.id === id ? { ...c, bookmarked: !c.bookmarked } : c
          ),
        })),
      togglePrivacy: (id) =>
        set((state) => ({
          capsules: state.capsules.map((c) =>
            c.id === id ? { ...c, isPrivate: !c.isPrivate } : c
          ),
        })),
      toggleCrossed: (id) =>
        set((state) => ({
          capsules: state.capsules.map((c) =>
            c.id === id ? { ...c, crossed: !c.crossed } : c
          ),
        })),
      clearAll: () => set({ capsules: [] }),
    }),
    { name: "capsules" }
  )
);
