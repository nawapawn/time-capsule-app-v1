// CapsuleContext.tsx
"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { CapsuleType } from "@/utils/capsuleUtils";

// ----- ประเภทของ Context -----
// กำหนดว่า CapsuleContext จะมี feedData, savedData และฟังก์ชันสำหรับ bookmark
interface CapsuleContextType {
  feedData: CapsuleType[]; // ข้อมูล feed ทั้งหมด
  savedData: CapsuleType[]; // ข้อมูล capsule ที่ bookmarked
  setFeedData: React.Dispatch<React.SetStateAction<CapsuleType[]>>; // ฟังก์ชันอัปเดต feedData
  toggleBookmark: (capsule: CapsuleType) => void; // bookmark/unbookmark capsule
  isBookmarked: (id: number) => boolean; // ตรวจสอบ capsule ว่าถูก bookmark หรือไม่
}

// สร้าง Context
const CapsuleContext = createContext<CapsuleContextType | undefined>(undefined);

// ----- Provider -----
// ใช้ wrap component หลัก เพื่อให้ทุก component ลูกเข้าถึง feedData / savedData ได้
export const CapsuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [feedData, setFeedData] = useState<CapsuleType[]>([]); // feed data
  const [savedData, setSavedData] = useState<CapsuleType[]>([]); // capsule bookmark

  // โหลดข้อมูล bookmark จาก localStorage ตอน component mount
  useEffect(() => {
    const saved = localStorage.getItem("savedCapsules");
    if (saved) setSavedData(JSON.parse(saved)); // ถ้ามี ก็เซ็ตค่า
  }, []);

  // บันทึก savedData ทุกครั้งที่เปลี่ยนไปที่ localStorage
  useEffect(() => {
    localStorage.setItem("savedCapsules", JSON.stringify(savedData));
  }, [savedData]);

  // ----- ฟังก์ชัน toggleBookmark -----
  const toggleBookmark = (capsule: CapsuleType) => {
    // อัปเดต savedData
    setSavedData((prev) => {
      const exists = prev.find((c) => c.id === capsule.id);
      if (exists) {
        // ถ้า bookmarked แล้ว ให้ลบ
        return prev.filter((c) => c.id !== capsule.id);
      } else {
        // ถ้ายังไม่ bookmarked ให้เพิ่ม
        return [...prev, { ...capsule, bookmarked: true }];
      }
    });

    // อัปเดต feedData ด้วย เพื่อ sync icon bookmark
    setFeedData((prev) =>
      prev.map((c) =>
        c.id === capsule.id ? { ...c, bookmarked: !c.bookmarked } : c
      )
    );
  };

  // ----- ตรวจสอบว่า capsule ถูก bookmark หรือไม่ -----
  const isBookmarked = (id: number) => savedData.some((c) => c.id === id.toString());

  return (
    <CapsuleContext.Provider
      value={{ feedData, savedData, setFeedData, toggleBookmark, isBookmarked }}
    >
      {children} {/* children คือ component ที่ wrap ด้วย Provider */}
    </CapsuleContext.Provider>
  );
};

// ----- Hook สำหรับเรียกใช้งาน context -----
export const useCapsule = () => {
  const context = useContext(CapsuleContext);
  if (!context) throw new Error("useCapsule must be used within CapsuleProvider");
  return context;
};
