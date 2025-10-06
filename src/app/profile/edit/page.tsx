"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, User, Mail, Tag, Save, X } from "lucide-react"; 
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import Avatar from "@/components/Avatar";
import { useProfileStore, UserProfile } from "@/store/profileStore"; 
import CosmicToast from "@/components/CosmicToast";

export default function ProfileEditPage() {
    const router = useRouter();
    
    const { profile: storedProfile, updateProfile } = useProfileStore();

    const [localProfile, setLocalProfile] = useState<UserProfile>(storedProfile);
    const [showToast, setShowToast] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalProfile(prev => ({ ...prev, [name]: value }));
    };
    
    // 🚀 NEW FUNCTION: จัดการการเปลี่ยนแปลงไฟล์ Avatar
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 1. สร้าง URL ชั่วคราวจากไฟล์ที่เลือก
            const newAvatarUrl = URL.createObjectURL(file);
            
            // 2. อัปเดต localProfile ทันทีเพื่อแสดงผลแบบ Real-Time
            setLocalProfile(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
            
            // 3. ⚠️ IMPORTANT: ใน Production, คุณจะต้องอัปโหลดไฟล์จริง
            // และอัปเดต localProfile ด้วย URL ที่มาจาก Server (Backend)
            // เช่น: uploadFile(file).then(serverUrl => setLocalProfile(...));
            
            // เนื่องจากนี่คือตัวอย่างใน Local Store เราจึงใช้ URL.createObjectURL()
            // ซึ่งต้องจำไว้ว่ามันเป็น URL ชั่วคราวที่ใช้ได้แค่ใน Session นี้
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // อัปเดต Global Store
        updateProfile(localProfile); 

        // แสดง Toast Notification
        setShowToast(true);
        
        // ตั้งเวลา Redirect
        setTimeout(() => {
            // ⚠️ ต้องจำไว้ว่า newAvatarUrl ที่สร้างด้วย URL.createObjectURL() 
            // จะไม่สามารถใช้งานได้อีกเมื่อหน้านี้ถูก Unmount และ Mount ใหม่
            // ในการใช้งานจริง, store จะเก็บ URL ที่มาจาก Server เท่านั้น
            router.push('/profile');
            
            // 💥 ควรมีการเรียก URL.revokeObjectURL(localProfile.avatarUrl) 
            // หาก URL นั้นถูกสร้างด้วย createObjectURL เพื่อเคลียร์ Memory
            // แต่เราจะละไว้ก่อนเพื่อความเรียบง่ายของตัวอย่างนี้
        }, 1500); // 1.5 วินาที
    };
    
    const handleCancel = () => {
        router.push('/profile');
    };

    return (
        // พื้นหลังสีขาวและข้อความหลักสีดำ
        <main className="min-h-screen bg-white text-gray-900 relative overflow-hidden px-6 py-8">
            
            {/* 💥 TOAST NOTIFICATION: ใช้ CosmicToast */}
            {showToast && (
                <CosmicToast 
                    message="Profile Updated! Your interstellar identity has been saved."
                    type="success"
                    duration={1500}
                    onClose={() => setShowToast(false)} 
                />
            )}
            
            <div className="max-w-xl mx-auto relative z-10 pb-20">
                
                {/* Header Title */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    // 🖤 เปลี่ยนจาก Gradient เป็นสีดำ Solid
                    className="text-3xl font-extrabold mb-8 text-gray-900"
                >
                    Edit Interstellar Identity
                </motion.h1>

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-gray-50 border border-gray-200 shadow-xl space-y-6">
                    
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                        {/* Avatar Component ได้รับการปรับปรุงให้เป็นสีดำแล้ว */}
                        <Avatar name={localProfile.name} size={96} avatarUrl={localProfile.avatarUrl} />
                        <motion.label 
                            whileHover={{ scale: 1.05 }}
                            // 🖤 ปุ่ม Upload: เปลี่ยนเป็นสีดำ Solid
                            className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gray-900 border border-gray-900 cursor-pointer hover:bg-black transition shadow-lg shadow-gray-400/50"
                        >
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                // 🚀 NEW: เมื่อมีการเลือกไฟล์, เรียกใช้ handleAvatarChange
                                onChange={handleAvatarChange} 
                            />
                            <Upload size={16} className="inline mr-2" />
                            Upload Avatar
                        </motion.label>
                    </div>

                    {/* Name Field */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        {/* Label/Icon ใช้สีเทาเข้ม */}
                        <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <User size={16} className="mr-2 text-gray-700" /> Username
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={localProfile.name}
                            onChange={handleChange}
                            placeholder="Your astronaut name"
                            required
                            // Input Field ธีมสว่าง: Focus Ring เป็นสีดำ
                            className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm"
                        />
                    </motion.div>

                    {/* Email Field */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        {/* Label/Icon ใช้สีเทาเข้ม */}
                        <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Mail size={16} className="mr-2 text-gray-700" /> Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={localProfile.email}
                            onChange={handleChange}
                            placeholder="astro@spacemail.com"
                            required
                            // Input Field ธีมสว่าง: Focus Ring เป็นสีดำ
                            className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm"
                        />
                    </motion.div>

                    {/* Bio/Tagline Field */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        {/* Label/Icon ใช้สีเทาเข้ม */}
                        <label htmlFor="tagline" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Tag size={16} className="mr-2 text-gray-700" /> Bio / Tagline
                        </label>
                        <textarea
                            id="tagline"
                            name="tagline"
                            value={localProfile.tagline}
                            onChange={handleChange}
                            placeholder="A short description about your journey..."
                            rows={3}
                            // Textarea Field ธีมสว่าง: Focus Ring เป็นสีดำ
                            className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition resize-none shadow-sm"
                        />
                    </motion.div>

                    {/* 💥 ปุ่ม Cancel และ Save Changes (จัดชิดซ้าย/ขวา) */}
                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                        {/* ปุ่ม Cancel (ล่างซ้าย) */}
                        <motion.button
                            type="button" // กำหนดเป็น type="button" เพื่อไม่ให้ submit form
                            onClick={handleCancel} // 👈 ฟังก์ชันยกเลิก
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            // ⚪️ ปุ่ม Cancel: สีเทาอ่อน/ขาวมินิมอล
                            className="px-6 py-3 rounded-xl bg-white hover:bg-gray-100 text-base font-semibold border border-gray-300 transition text-gray-700 shadow-sm"
                        >
                            <X size={20} className="inline mr-2" />
                            Cancel
                        </motion.button>
                        
                        {/* ปุ่ม Save Changes (ล่างขวา) */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.03, boxShadow: "0 0 18px rgba(0, 0, 0, 0.4)" }} // ปรับเงาเป็นสีดำ
                            whileTap={{ scale: 0.98 }}
                            // 🖤 ปุ่ม Save Changes: เปลี่ยนจาก Gradient เป็นสีดำ Solid
                            className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-black text-base font-bold text-white shadow-lg shadow-gray-400/50 transition"
                        >
                            <Save size={20} className="inline mr-2" />
                            Save Changes
                        </motion.button>
                    </div>

                </form>
            </div>
        </main>
    );
}