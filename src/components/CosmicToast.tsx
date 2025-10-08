// CosmicToast component สำหรับแสดง toast notification
"use client"; // บอก Next.js ว่า component นี้ทำงานฝั่ง client

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // สำหรับ animation แสดง/ซ่อน
import { CheckCircle, X } from 'lucide-react'; // ไอคอน success และ close

interface ToastProps {
    message: string; // ข้อความที่จะแสดง
    type?: 'success' | 'error'; // ประเภท toast
    duration?: number; // ระยะเวลาที่ toast แสดงผล (ms)
    onClose: () => void; // callback ตอนปิด toast
}

export default function CosmicToast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
    
    // 🔄 useEffect ตั้งเวลาปิด toast อัตโนมัติ
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(); // เรียก callback ปิด toast
        }, duration);
        return () => clearTimeout(timer); // cleanup ป้องกัน memory leak
    }, [duration, onClose]);

    // กำหนดสีและไอคอนตาม type
    const typeProps = type === 'success' ? {
        icon: CheckCircle,           // icon success
        iconBg: 'bg-violet-500',     // สี background icon
        borderColor: 'border-violet-400', // สี border
        textColor: 'text-gray-900',  // สีข้อความ
    } : {
        icon: X,                     // icon error
        iconBg: 'bg-red-500',
        borderColor: 'border-red-400',
        textColor: 'text-gray-900',
    };

    const IconComponent = typeProps.icon; // แยก icon ออกมาใช้ใน JSX

    return (
        // AnimatePresence ใช้กับ motion.div เพื่อให้ animate ตอน mount/unmount
        <AnimatePresence>
            <motion.div
                // 🔹 Animation: เด้งลงมาจากบน แล้ว fade ออกเมื่อปิด
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                
                className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] 
                            p-4 rounded-xl shadow-lg 
                            bg-white/80 backdrop-blur-md 
                            border ${typeProps.borderColor} flex items-center max-w-sm w-full`}
            >
                {/* Icon ด้านซ้าย */}
                <div className={`p-1.5 rounded-full ${typeProps.iconBg} mr-3 flex-shrink-0 shadow-md`}>
                     <IconComponent size={20} className="text-white" />
                </div>
               
                {/* ข้อความ toast */}
                <p className={`font-medium text-sm flex-grow ${typeProps.textColor}`}>
                    {message}
                </p>
                
                {/* ปุ่มปิด toast */}
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
