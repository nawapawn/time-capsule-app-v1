// src/components/CosmicToast.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error';
    duration?: number; // ระยะเวลาแสดงผลเป็นมิลลิวินาที
    onClose: () => void;
}

export default function CosmicToast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
    
    // ตั้งเวลาปิดตัวเอง
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    // การตั้งค่าสีและไอคอนตาม Type
    const typeProps = type === 'success' ? {
        icon: CheckCircle,
        // ⚪️ Success: ใช้สีเขียว/ม่วงสำหรับ Icon และ Border
        iconBg: 'bg-violet-500', 
        borderColor: 'border-violet-400',
        textColor: 'text-gray-900',
    } : {
        icon: X,
        // ⚪️ Error: ใช้สีแดงสำหรับ Icon และ Border
        iconBg: 'bg-red-500', 
        borderColor: 'border-red-400',
        textColor: 'text-gray-900',
    };

    const IconComponent = typeProps.icon;

    return (
        // AnimatePresence สำหรับการแสดง/ซ่อน Toast
        <AnimatePresence>
            <motion.div
                // การตั้งค่าแอนิเมชัน: เด้งลงมาจากด้านบน
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                
                className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] 
                            p-4 rounded-xl shadow-lg 
                            // ⚪️ Light Glassmorphism: พื้นหลังขาวโปร่งแสง
                            bg-white/80 backdrop-blur-md 
                            border ${typeProps.borderColor} flex items-center max-w-sm w-full`}
            >
                {/* Icon Container: ใช้สี Solid Bold */}
                <div className={`p-1.5 rounded-full ${typeProps.iconBg} mr-3 flex-shrink-0 shadow-md`}>
                     <IconComponent size={20} className="text-white" />
                </div>
               
                {/* ข้อความ: สีดำสำหรับพื้นหลังขาว */}
                <p className={`font-medium text-sm flex-grow ${typeProps.textColor}`}>
                    {message}
                </p>
                
                {/* ปุ่มปิด (X) */}
                <button 
                    onClick={onClose} 
                    className="ml-4 p-1 rounded-full text-gray-500 hover:bg-gray-200 transition flex-shrink-0"
                    aria-label="Close notification"
                >
                    <X size={16} />
                </button>
            </motion.div>
        </AnimatePresence>
    );
}