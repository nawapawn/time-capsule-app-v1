// src/components/CapsuleCard.tsx (Updated)
"use client";

import React, { useState } from "react";
import { Capsule } from "@/types";
import { Lock, Unlock, Users, User } from "lucide-react"; 

interface CapsuleCardProps {
  capsule: Capsule;
}

// ⚪️ ฟังก์ชันช่วยในการกำหนดสีและไอคอนตามสถานะ Visibility (Monochrome Light Mode) ⚪️
const getVisibilityProps = (visibility: Capsule['visibility']) => {
  switch (visibility) {
    case 'Public':
      return {
        icon: Users,
        text: 'PUBLIC',
        // 🖤 Monochrome: เน้นความตัดกัน (พื้นหลังเทาอ่อนมาก / ข้อความดำ)
        className: 'bg-gray-100/70 text-gray-900 shadow-sm shadow-gray-300/30',
      };
    case 'Private':
      return {
        icon: User,
        text: 'PRIVATE',
        // 🖤 Monochrome: โทนเทาเข้มขึ้นเล็กน้อย
        className: 'bg-gray-200 text-gray-800 shadow-sm shadow-gray-400/30',
      };
    default:
      // ✅ Default Case ถูกปรับให้ส่งคืนค่า Private (และลบคำว่า UNKNOWN ออก)
      return {
        icon: User, 
        text: 'PRIVATE', // แสดงเป็น PRIVATE แม้จะมีค่า Visibility ที่ไม่รู้จัก
        className: 'bg-gray-200 text-gray-800 shadow-sm shadow-gray-400/30',
      };
  }
};


export default function CapsuleCard({ capsule }: CapsuleCardProps) {
  // 1. เพิ่ม State เพื่อควบคุมการแสดงรายละเอียด
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const unlockDate = new Date(capsule.unlockAt || Date.now());
  const isLocked = unlockDate.getTime() > Date.now(); 

  // 2. ฟังก์ชันจัดการการคลิก
  const handleCardClick = () => {
    if (!isLocked) {
      // ถ้าโพสต์เปิดแล้ว (Unlocked): ให้สลับการแสดงรายละเอียด
      setIsDetailVisible(!isDetailVisible);
    } else {
      // ถ้าโพสต์ยังไม่เปิด (Locked): ล็อกการแสดงรายละเอียด
      setIsDetailVisible(false);
      // ถ้าต้องการให้มี feedback เช่น alert ก็สามารถเพิ่มได้
      // alert(`แคปซูลนี้จะเปิดได้ในวันที่: ${unlockDate.toLocaleDateString()}`);
    }
  };
  
  const visibilityProps = getVisibilityProps(capsule.visibility);
  const VisibilityIcon = visibilityProps.icon; 

  return (
    <div 
      // 3. ใส่ onClick handler
      onClick={handleCardClick}
      className={`p-5 rounded-2xl 
        // Light Glassmorphism: พื้นหลังขาวโปร่งแสง, เงาเบาๆ
        bg-white/70 backdrop-blur-md shadow-lg 
        transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out 
        // Border สีเทาอ่อน
        border border-gray-200 
        // Border สี Accent: ปรับ Hover Border ให้เป็นสีเทาเข้ม/ดำ
        hover:border-gray-500
        // เพิ่ม cursor-pointer เพื่อบ่งบอกว่าคลิกได้
        cursor-pointer` 
      }
    >
      
      <div className="flex items-center justify-between mb-3">
        {/* ชื่อ Capsule: สีดำล้วน */}
        <h3 className="font-bold text-xl text-gray-900"> 
          {capsule.title}
        </h3>
        {/* ไอคอน Lock/Unlock: สีเทาเข้ม */}
        {isLocked ? (
          <Lock size={20} className="text-gray-600 flex-shrink-0" /> 
        ) : (
          <Unlock size={20} className="text-gray-600 flex-shrink-0" /> 
        )}
      </div>
      
      {/* Date & Tag */}
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs text-gray-500 font-mono"> 
          {isLocked ? "LOCK DATE: " : "UNLOCKED: "}
          {unlockDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        
        {/* 1. VISIBILITY TAG */}
        <div className={`inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full ${visibilityProps.className}`}>
          <VisibilityIcon size={10} className="mr-1" />
          {visibilityProps.text}
        </div>
        
      </div>
          
      {/* 4. ส่วนแสดงรายละเอียดตามเงื่อนไข */}
      {isLocked ? (
        // A. โพสต์ที่ยังไม่เปิด (Locked)
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic flex items-center">
            <Lock size={14} className="mr-2" />
            This capsule is locked until its scheduled opening date.
          </p>
        </div>
      ) : (
        // B. โพสต์ที่เปิดแล้ว (Unlocked)
        <div className="mt-4 pt-3 border-t border-gray-200">
          {isDetailVisible ? (
            // B.1 แสดงรายละเอียดเมื่อคลิก (เปิดแล้ว)
            // **NOTE:** ต้องแน่ใจว่า Type Capsule มี field ชื่อ content
            <p className="text-gray-700 text-sm whitespace-pre-wrap">
              {capsule.content || "ไม่มีเนื้อหาในแคปซูลนี้"}
            </p>
          ) : (
            // B.2 ข้อความเชิญชวนให้คลิกเพื่อดูรายละเอียด
            <p className="text-gray-500 text-sm font-semibold hover:text-gray-900 transition-colors">
              View details...
            </p>
          )}
        </div>
      )}
    </div>
  );
}