"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { CapsuleType } from "@/utils/capsuleUtils";

interface CapsuleContextType {
  feedData: CapsuleType[];
  savedData: CapsuleType[];
  setFeedData: React.Dispatch<React.SetStateAction<CapsuleType[]>>;
  toggleBookmark: (capsule: CapsuleType) => void;
  isBookmarked: (id: number) => boolean;
}

const CapsuleContext = createContext<CapsuleContextType | undefined>(undefined);

export const CapsuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [feedData, setFeedData] = useState<CapsuleType[]>([]);
  const [savedData, setSavedData] = useState<CapsuleType[]>([]);

  // โหลดจาก localStorage ครั้งแรก
  useEffect(() => {
    const saved = localStorage.getItem("savedCapsules");
    if (saved) setSavedData(JSON.parse(saved));
  }, []);

  // บันทึกทุกครั้งที่ savedData เปลี่ยน
  useEffect(() => {
    localStorage.setItem("savedCapsules", JSON.stringify(savedData));
  }, [savedData]);

  const toggleBookmark = (capsule: CapsuleType) => {
    setSavedData((prev) => {
      const exists = prev.find((c) => c.id === capsule.id);
      if (exists) {
        return prev.filter((c) => c.id !== capsule.id);
      } else {
        return [...prev, { ...capsule, bookmarked: true }];
      }
    });

    // อัปเดตใน feedData ด้วย
    setFeedData((prev) =>
      prev.map((c) =>
        c.id === capsule.id ? { ...c, bookmarked: !c.bookmarked } : c
      )
    );
  };

  const isBookmarked = (id: number) => savedData.some((c) => c.id === id.toString());

  return (
    <CapsuleContext.Provider
      value={{ feedData, savedData, setFeedData, toggleBookmark, isBookmarked }}
    >
      {children}
    </CapsuleContext.Provider>
  );
};

export const useCapsule = () => {
  const context = useContext(CapsuleContext);
  if (!context) throw new Error("useCapsule must be used within CapsuleProvider");
  return context;
};
