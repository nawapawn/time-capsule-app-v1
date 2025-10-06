"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CalendarDays, Rocket, X, Lock } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import CapsuleCard from "@/components/CapsuleCard";
import { mockCapsules } from "@/lib/mockData";
import CreateCapsuleForm from "@/components/CreateCapsuleForm";
import { useProfileStore } from "@/store/profileStore";
import { Capsule } from "@/types";

const NEARBY_THRESHOLD = 0.015;
const Y_OFFSET_DISTANCE = 30;

export default function ProfilePage() {
  const { profile } = useProfileStore();
  const [capsules, setCapsules] = useState<Capsule[]>(mockCapsules as Capsule[]);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const toggleCreateModal = () => setIsCreateModalOpen(prev => !prev);

  const addNewCapsule = useCallback((newCapsule: Capsule) => {
    setCapsules(prev => [newCapsule, ...prev]);
  }, []);

  const timelineYears = useMemo(() => {
    if (!capsules.length) return [];
    const years = capsules.reduce((acc, capsule) => {
      const year = new Date(capsule.unlockAt).getFullYear();
      if (!acc[year]) acc[year] = { capsules: [], minDate: Infinity, maxDate: -Infinity };
      const ts = new Date(capsule.unlockAt).getTime();
      acc[year].capsules.push(capsule);
      acc[year].minDate = Math.min(acc[year].minDate, ts);
      acc[year].maxDate = Math.max(acc[year].maxDate, ts);
      return acc;
    }, {} as Record<number, { capsules: Capsule[]; minDate: number; maxDate: number }>);

    const allDates = capsules.map(c => new Date(c.unlockAt).getTime());
    const globalMinDate = Math.min(...allDates);
    const globalMaxDate = Math.max(...allDates);
    const totalRange = globalMaxDate - globalMinDate;

    return Object.entries(years)
      .map(([year, data]) => ({
        year,
        position: totalRange > 0 ? (data.minDate - globalMinDate) / totalRange : 0,
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [capsules]);

  const calculatePositionStyle = useCallback((position: number) => ({
    left: `${(position * 100).toFixed(4)}%`,
    transform: "translateX(-50%)"
  }), []);

  const positionedCapsules = useMemo(() => {
    if (!capsules.length) return [];
    const sorted = capsules
      .map(c => ({ ...c, timestamp: new Date(c.unlockAt).getTime() }))
      .sort((a, b) => a.timestamp - b.timestamp);

    const allDates = sorted.map(c => c.timestamp);
    const minDate = Math.min(...allDates);
    const maxDate = Math.max(...allDates);
    const totalRange = maxDate - minDate;

    if (totalRange <= 0)
      return sorted.map((c, i) => ({
        ...c,
        position: 0.5,
        yOffset: (i % 2 === 0 ? 1 : -1) * Y_OFFSET_DISTANCE
      }));

    const positioned = sorted.map(c => ({ ...c, position: (c.timestamp - minDate) / totalRange, yOffset: 0 }));

    for (let i = 1; i < positioned.length; i++) {
      const cur = positioned[i];
      const prev = positioned[i - 1];
      if (cur.position - prev.position < NEARBY_THRESHOLD) {
        cur.yOffset = prev.yOffset === 0 ? Y_OFFSET_DISTANCE : (prev.yOffset === Y_OFFSET_DISTANCE ? -Y_OFFSET_DISTANCE : Y_OFFSET_DISTANCE);
        if (prev.yOffset === 0) prev.yOffset = -Y_OFFSET_DISTANCE;
      } else {
        cur.yOffset = 0;
      }
    }

    return positioned;
  }, [capsules]);

  return (
    <main className="min-h-screen bg-white text-gray-900 relative overflow-hidden px-6 pt-24 pb-20">
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateCapsuleForm
            onCreate={addNewCapsule}
            onClose={() => setIsCreateModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto relative z-10 pb-20">
        {/* Header */}
        <section className="flex flex-col items-center mb-12">
          <motion.div
            initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 shadow-md"
          >
            <Avatar name={profile.name} size={96} avatarUrl={profile.avatarUrl} />
          </motion.div>

          <h1 className="text-4xl font-extrabold mt-6 text-gray-900">{profile.name}</h1>
          <p className="text-base text-gray-600">{profile.email}</p>
          <p className="text-md text-gray-500 italic mt-2 text-center max-w-[28rem] font-light">“{profile.tagline}”</p>

          <div className="mt-8 flex gap-4">
            <Link href="/profile/edit" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-sm border border-gray-300 shadow-sm transition text-gray-700"
              >
                Edit Profile
              </motion.button>
            </Link>

            <motion.button
              onClick={toggleCreateModal}
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(0,0,0,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-sm font-semibold border border-gray-900 shadow-lg shadow-gray-400/50 transition text-white"
            >
              <Rocket size={16} className="inline mr-2" /> New Capsule
            </motion.button>
          </div>
        </section>

        {/* Timeline */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-8 flex items-center gap-3 border-b border-gray-200 pb-2">
            <CalendarDays size={20} className="text-violet-500" /> Time-Warp Timeline
          </h2>

          <div className="relative w-full h-40 mt-8">
            <div className="absolute inset-x-0 top-[-1.5rem] flex justify-between h-8">
              {timelineYears.map(item => (
                <div key={item.year} style={calculatePositionStyle(item.position)} className="absolute text-sm font-bold text-gray-800 opacity-90">
                  {item.year}
                </div>
              ))}
            </div>

            <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-gray-300"></div>

            <div className="absolute inset-0 flex items-center px-4" style={{ top: '35%' }}>
              {positionedCapsules.map((capsule, index) => {
                const date = new Date(capsule.unlockAt);
                const label = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
                return (
                  <motion.div
                    key={capsule.id}
                    initial={{ scale: 0, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: capsule.yOffset + 'px' }}
                    transition={{ duration: 0.6, type: "spring", delay: 0.2 + index * 0.1 }}
                    className="flex flex-col items-center group cursor-pointer absolute z-20"
                    style={calculatePositionStyle(capsule.position)}
                    onClick={() => setSelectedCapsule(capsule)}
                  >
                    <div className="absolute w-5 h-5 rounded-full top-0 border-3 z-10 bg-violet-600" style={{ transform: 'translateY(-50%)', border: '3px solid #fff', boxShadow: '0 0 6px rgba(139,92,246,0.3)' }}></div>
                    <div className="absolute w-5 h-5 rounded-full top-0 bg-transparent transition-all duration-300 group-hover:scale-[1.6] group-hover:shadow-[0_0_15px_#a78bfa,0_0_30px_rgba(139,92,246,0.2)] z-0" style={{ transform: 'translateY(-50%)' }}></div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                      className={`text-xs font-medium text-gray-500 group-hover:text-violet-600 transition-colors ${capsule.yOffset > 0 ? 'mt-10' : 'mt-4'}`}>
                      {label}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Capsules List */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 border-b border-gray-200 pb-2">
            <Clock size={20} className="text-violet-500" /> My Capsules
          </h2>
          <div className="space-y-4">
            {capsules.map(capsule => (
              <motion.div
                key={capsule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => setSelectedCapsule(capsule)}
                className="cursor-pointer"
              >
                <CapsuleCard capsule={capsule} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Capsule Modal */}
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
              className="rounded-3xl p-8 max-w-md w-full relative bg-white/70 backdrop-blur-xl border border-gray-100 shadow-lg"
              initial={{ scale: 0.7, opacity: 0, rotateX: 30 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotateX: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition" onClick={() => setSelectedCapsule(null)}>
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold mb-2 text-violet-600">{selectedCapsule.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 border-b border-gray-200 pb-2">
                <p>{new Date(selectedCapsule.unlockAt).getTime() > Date.now() ? "LOCKED until:" : "UNLOCKED on:"} {new Date(selectedCapsule.unlockAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${selectedCapsule.visibility === 'Public' ? 'bg-violet-100 text-violet-700' : 'bg-pink-100 text-pink-700'}`}>
                  {selectedCapsule.visibility.toUpperCase()}
                </span>
              </div>

              {new Date(selectedCapsule.unlockAt).getTime() > Date.now() ? (
                <div className="bg-red-50 p-4 rounded-xl flex flex-col items-center justify-center text-red-600 font-semibold border border-red-200 mt-4">
                  <Lock size={24} className="mb-2" />
                  <p className="text-lg">Contents are securely time-locked.</p>
                  <p className="text-sm font-normal text-gray-600 mt-1">Please check back on {new Date(selectedCapsule.unlockAt).toLocaleDateString()}</p>
                </div>
              ) : (
                <div className="mt-4 max-h-80 overflow-y-auto">
                  <h4 className="font-semibold text-gray-800 mb-2 border-b pb-1">Capsule Content:</h4>
                  <p className="text-gray-700 text-base whitespace-pre-wrap leading-relaxed">{selectedCapsule.content || "⚠️ ไม่มีเนื้อหาที่ระบุไว้สำหรับแคปซูลนี้"}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
