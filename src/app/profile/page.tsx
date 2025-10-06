// src/app/profile/page.tsx (โค้ดที่ได้รับการแก้ไขและรวม)

"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CalendarDays, Rocket, X, Lock } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import CapsuleCard from "@/components/CapsuleCard";
import { mockCapsules } from "@/lib/mockData";
import { Capsule } from "@/types";
import { useProfileStore } from "@/store/profileStore";
// 💥 นำเข้า Component สำหรับสร้างแคปซูล (โครงสร้างไฟล์ที่จำได้: src\components\CreateCapsuleForm.tsx)
import CreateCapsuleForm from "@/components/CreateCapsuleForm"; 

export default function ProfilePage() {
    const { profile } = useProfileStore();
    const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
    // 💥 State สำหรับควบคุม Modal Form สร้างแคปซูลใหม่ (ค่าเริ่มต้นคือ false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const toggleCreateModal = () => setIsCreateModalOpen(prev => !prev);

    // ใช้ useMemo เพื่อคำนวณตำแหน่งและข้อมูลของปี (Years)
    const timelineYears = useMemo(() => {
        if (!mockCapsules.length) return [];

        const years = mockCapsules.reduce((acc, capsule) => {
            const year = new Date(capsule.unlockAt).getFullYear();
            if (!acc[year]) {
                acc[year] = { capsules: [], minDate: Infinity, maxDate: -Infinity, };
            }
            const unlockTime = new Date(capsule.unlockAt).getTime();
            acc[year].capsules.push(capsule);
            acc[year].minDate = Math.min(acc[year].minDate, unlockTime);
            acc[year].maxDate = Math.max(acc[year].maxDate, unlockTime);
            return acc;
        }, {} as Record<number, { capsules: Capsule[], minDate: number, maxDate: number }>);

        const allDates = mockCapsules.map(c => new Date(c.unlockAt).getTime());
        const globalMinDate = Math.min(...allDates);
        const globalMaxDate = Math.max(...allDates);
        const totalRange = globalMaxDate - globalMinDate;

        return Object.entries(years).map(([year, data]) => {
            const firstCapsuleTime = data.minDate;

            const position = totalRange > 0
                ? (firstCapsuleTime - globalMinDate) / totalRange
                : 0;

            return { year: year, position: position, };
        }).sort((a, b) => parseInt(a.year) - parseInt(b.year));
    }, [mockCapsules]);

    return (
        // ********** ⚪️ ธีมสีขาวมินิมอล (Minimal White) ⚪️ **********
        <main className="min-h-screen bg-white text-gray-900 relative overflow-hidden px-6 py-8">
            
            {/* 💥 1. Modal Form สร้างแคปซูลใหม่ (แก้ไข: ใช้ AnimatePresence และ Conditional Rendering) */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <CreateCapsuleForm 
                        // เราไม่ต้องส่ง show prop อีกแล้ว เพราะเราใช้ Conditional Rendering 
                        onClose={() => setIsCreateModalOpen(false)} 
                    />
                )}
            </AnimatePresence>
            {/* หาก CreateCapsuleForm มีการใช้ Framer Motion ภายในตัวเอง, AnimatePresence จะจัดการการ Fade-out เมื่อ state เป็น false */}


            <div className="max-w-3xl mx-auto relative z-10 pb-20">

                {/* Header Section */}
                <section className="flex flex-col items-center mb-12">
                    <motion.div
                        initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                        // Border/Background สำหรับธีมขาวมินิมอล
                        className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 shadow-md"
                    >
                        <Avatar name={profile.name} size={96} avatarUrl={profile.avatarUrl} />
                    </motion.div>

                    {/* ข้อความชื่อ/อีเมล เป็นสีดำ/เทาเข้ม */}
                    <h1 className="text-4xl font-extrabold mt-6 text-gray-900">
                        {profile.name}
                    </h1>
                    <p className="text-base text-gray-600">{profile.email}</p>
                    {/* Tagline ใช้สีเทาอ่อนลง */}
                    <p className="text-md text-gray-500 italic mt-2 text-center max-w-[28rem] font-light">
                        “{profile.tagline}”
                    </p>

                    <div className="mt-8 flex gap-4">
                        <Link href="/profile/edit" passHref>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                // ปุ่ม Edit Profile ธีมขาวมินิมอล
                                className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-sm border border-gray-300 shadow-sm transition text-gray-700"
                            >
                                Edit Profile
                            </motion.button>
                        </Link>

                        {/* 💥 2. ปุ่ม New Capsule: ใช้ onClick={toggleCreateModal} */}
                        <motion.button
                            onClick={toggleCreateModal} // 👈 ฟังก์ชันเปิด Modal
                            whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            // 🖤 ปุ่ม New Capsule: เปลี่ยนเป็นสีดำ Solid
                            className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-sm font-semibold border border-gray-900 shadow-lg shadow-gray-400/50 transition text-white"
                        >
                            <Rocket size={16} className="inline mr-2" /> New Capsule
                        </motion.button>
                    </div>
                </section>

                {/* 🌟 Timeline Calendar 🌟 */}
                <section className="mt-12">
                    {/* Title */}
                    <h2 className="text-xl font-semibold mb-8 flex items-center gap-3 border-b border-gray-200 pb-2">
                        <CalendarDays size={20} className="text-violet-500" /> Time-Warp Timeline
                    </h2>

                    <div className="relative w-full h-24 mt-4">
                        {/* Year Labels */}
                        <div className="absolute inset-x-0 top-[-1.5rem] flex justify-between h-8">
                            {timelineYears.map((item) => (
                                <div
                                    key={item.year}
                                    style={{ left: `${item.position * 100}%`, transform: 'translateX(-50%)' }}
                                    // ⚪️ Year Label ใช้สีเทาเข้ม
                                    className="absolute text-sm font-bold text-gray-800 opacity-90"
                                >
                                    {item.year}
                                </div>
                            ))}
                        </div>

                        {/* Timeline line - ❌ นำ Gradient ออก, ใช้สีเทาอ่อน solid แทน */}
                        <div
                            className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-gray-300"
                            style={{
                                // ❌ ไม่มี background gradient
                                boxShadow: 'none',
                            }}
                        ></div>

                        {/* Capsule points */}
                        <div className="absolute inset-0 flex items-center px-4 pt-0">
                            {mockCapsules
                                .sort((a, b) => new Date(a.unlockAt).getTime() - new Date(b.unlockAt).getTime())
                                .map((capsule, index) => {
                                    const date = new Date(capsule.unlockAt);
                                    const label = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });

                                    const allDates = mockCapsules.map(c => new Date(c.unlockAt).getTime());
                                    const globalMinDate = Math.min(...allDates);
                                    const globalMaxDate = Math.max(...allDates);
                                    const totalRange = globalMaxDate - globalMinDate;
                                    const position = totalRange > 0
                                        ? (date.getTime() - globalMinDate) / totalRange
                                        : 0;

                                    // ⚪️ ใช้สีม่วง Solid สำหรับจุดที่ Active/Hover
                                    const dotColorClass = 'bg-violet-600';

                                    return (
                                        <motion.div
                                            key={capsule.id}
                                            initial={{ scale: 0, opacity: 0, y: -20 }}
                                            animate={{ scale: 1, opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, type: "spring", delay: 0.2 + index * 0.1 }}
                                            className="flex flex-col items-center group cursor-pointer absolute z-20"
                                            style={{ left: `${position * 100}%`, transform: 'translateX(-50%)' }}
                                            onClick={() => setSelectedCapsule(capsule)}
                                        >
                                            {/* **จุด Capsule (Base Dot)** - ❌ นำ Gradient ออก, ใช้สีม่วง Solid */}
                                            <div
                                                className={`absolute w-5 h-5 rounded-full top-0 border-3 transition-all duration-400 ease-out z-10 ${dotColorClass}`}
                                                style={{
                                                    background: '', // ❌ ไม่มี background (ใช้ Tailwind class)
                                                    boxShadow: '0 0 6px rgba(139, 92, 246, 0.3)', // Shadow สีม่วง
                                                    border: '3px solid #ffffff',
                                                    transform: 'translateY(-50%)'
                                                }}
                                            ></div>

                                            {/* **จุด Capsule (Hover Effect Overlay)** */}
                                            <div
                                                className="absolute w-5 h-5 rounded-full top-0 
                                                            bg-transparent transition-all duration-300 group-hover:scale-[1.6] group-hover:shadow-[0_0_15px_#a78bfa,0_0_30px_rgba(139,92,246,0.2)] z-0"
                                                style={{
                                                    transform: 'translateY(-50%)'
                                                }}
                                            ></div>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="mt-4 text-xs font-medium text-gray-500 group-hover:text-violet-600 transition-colors"
                                            >
                                                {label}
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                        </div>
                    </div>
                </section>

                {/* 💖 Capsules Section 💖 */}
                <section className="mt-12">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 border-b border-gray-200 pb-2">
                        <Clock size={20} className="text-violet-500" /> My Capsules
                    </h2>
                    <div className="space-y-4">
                        {mockCapsules.map((capsule) => (
                            <motion.div
                                key={capsule.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: Number(capsule.id) * 0.1 }}
                                onClick={() => setSelectedCapsule(capsule)}
                                className="cursor-pointer"
                            >
                                <CapsuleCard capsule={capsule} />
                            </motion.div>
                        ))}
                    </div>
                </section>

            </div>

            {/* ===== Capsule Modal - ธีมขาวมินิมอล/Solid Text (สำหรับดูรายละเอียดแคปซูล) ===== */}
            <AnimatePresence>
                {selectedCapsule && (
                    <motion.div
                        className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedCapsule(null)}
                    >
                        <motion.div
                            // Glassmorphism effect ธีมขาวมินิมอล
                            className="rounded-3xl p-8 max-w-md w-full relative bg-white/70 backdrop-blur-xl border border-gray-100 shadow-lg"
                            initial={{ scale: 0.7, opacity: 0, rotateX: 30 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.7, opacity: 0, rotateX: 30 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                // ปุ่มปิดใช้สีเทาเรียบๆ
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
                                onClick={() => setSelectedCapsule(null)}
                            >
                                <X size={24} />
                            </button>

                            {/* Modal Title - ใช้สี Solid เน้น */}
                            <h3 className="text-2xl font-bold mb-2 text-violet-600">
                                {selectedCapsule.title}
                            </h3>

                            {/* Modal Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 border-b border-gray-200 pb-2">
                                <p>
                                    {new Date(selectedCapsule.unlockAt).getTime() > Date.now() ? "LOCKED until:" : "UNLOCKED on:"}{" "}
                                    {new Date(selectedCapsule.unlockAt).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                                {/* Tag Visibility ใช้สีที่เบาลง */}
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${selectedCapsule.visibility === 'Public' ? 'bg-violet-100 text-violet-700' : selectedCapsule.visibility === 'Private' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {selectedCapsule.visibility.toUpperCase()}
                                </span>
                            </div>

                            {/* Lock Message */}
                            <div className="bg-pink-50 p-3 rounded-lg flex items-center justify-center text-pink-600 font-semibold border border-pink-100">
                                <Lock size={16} className="mr-2" />
                                Contents are securely time-locked until the unlock date.
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}