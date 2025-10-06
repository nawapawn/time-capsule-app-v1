// src/components/CapsuleCard.tsx (Minimal White - Monochrome Tags)
"use client";

import React from "react";
import { Capsule } from "@/types";
import { Lock, Unlock, Users, EyeOff, User } from "lucide-react"; 

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
        case 'Unlisted':
            return {
                icon: EyeOff,
                text: 'UNLISTED',
                // 🖤 Monochrome: โทนเทามาตรฐาน
                className: 'bg-gray-100 text-gray-700 shadow-sm shadow-gray-300/30',
            };
        default:
            return {
                icon: EyeOff,
                text: 'UNKNOWN',
                className: 'bg-gray-100 text-gray-700 shadow-sm shadow-gray-300/30',
            };
    }
};


export default function CapsuleCard({ capsule }: CapsuleCardProps) {
    const unlockDate = new Date(capsule.unlockAt);
    const isLocked = unlockDate.getTime() > Date.now(); 

    const visibilityProps = getVisibilityProps(capsule.visibility);
    const VisibilityIcon = visibilityProps.icon; 

    return (
        <div 
            className={`p-5 rounded-2xl 
                // Light Glassmorphism: พื้นหลังขาวโปร่งแสง, เงาเบาๆ
                bg-white/70 backdrop-blur-md shadow-lg 
                transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out 
                // Border สีเทาอ่อน
                border border-gray-200 
                // Border สี Accent: ปรับ Hover Border ให้เป็นสีเทาเข้ม/ดำ
                ${isLocked ? 'hover:border-gray-500' : 'hover:border-gray-500'}` 
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
                
                {/* 1. VISIBILITY TAG (ใช้สี Monochrome ที่กำหนดใหม่) */}
                <div className={`inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full ${visibilityProps.className}`}>
                    <VisibilityIcon size={10} className="mr-1" />
                    {visibilityProps.text}
                </div>
                
            </div>
        </div>
    );
}