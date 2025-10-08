"use client";

import React, { useState, useEffect } from "react"; // 💡 Import useEffect
import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
import { Upload, User, Mail, Tag, Save, X } from "lucide-react";
import Avatar from "@/components/Avatar";
import CosmicToast from "@/components/CosmicToast";
import { useProfileStore, UserProfile } from "@/store/profileStore";

export default function ProfileEditPage() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [showToast, setShowToast] = useState(false);
  // 💡 เก็บ URL ชั่วคราวเก่าไว้เพื่อ cleanup
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);

  // 💡 CLEANUP: ล้าง URL ชั่วคราวเก่าทุกครั้งที่ localProfile.avatarUrl เปลี่ยน
  useEffect(() => {
    // ถ้ามี tempAvatarUrl เดิมอยู่ และมันไม่ใช่ URL ปัจจุบัน ให้ทำการล้างทิ้ง
    if (tempAvatarUrl && tempAvatarUrl !== localProfile.avatarUrl) {
      URL.revokeObjectURL(tempAvatarUrl);
      setTempAvatarUrl(null); // ล้าง state tempAvatarUrl
    }
  }, [localProfile.avatarUrl, tempAvatarUrl]);

  // 💡 CLEANUP: ล้าง URL ชั่วคราวสุดท้ายเมื่อคอมโพเนนต์ถูกถอดออก
  useEffect(() => {
    return () => {
      if (tempAvatarUrl) {
        URL.revokeObjectURL(tempAvatarUrl);
      }
    };
  }, [tempAvatarUrl]); // ใช้ tempAvatarUrl ใน dependency array เพื่อให้แน่ใจว่าล้างตัวที่ถูกใช้ล่าสุด

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocalProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newAvatarUrl = URL.createObjectURL(file);
    
    // 💡 ตั้งค่า localProfile ให้แสดงรูปใหม่
    setLocalProfile((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
    // 💡 เก็บ URL ใหม่ไว้ใน state เพื่อใช้สำหรับ cleanup ในรอบถัดไป
    setTempAvatarUrl(newAvatarUrl); 

    // **หมายเหตุ:** หากต้องการล้าง URL เก่าทันทีที่เปลี่ยนไฟล์ใหม่
    // คุณอาจต้องใช้ callback form ของ setLocalProfile และ setTempAvatarUrl 
    // เพื่อให้จัดการการล้าง URL เก่าก่อนจะ set URL ใหม่ แต่การใช้ useEffect 
    // ตามโค้ดด้านบนจะจัดการได้ง่ายกว่าใน React
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(localProfile); // ✅ อัปเดต store ตอน submit
    setShowToast(true);
    // 💡 หาก URL ที่ถูกบันทึกใน store คือ URL ชั่วคราว (Object URL) 
    // คุณควรเปลี่ยนไปใช้การอัปโหลดจริงและใช้ URL ของรูปที่เซิร์ฟเวอร์
    // ตอบกลับมาแทน ก่อนจะ push ไปหน้าอื่น
    setTimeout(() => router.push("/profile"), 1500);
  };

  const handleCancel = () => router.push("/profile");

  return (
    <main className="min-h-screen bg-white px-6 py-8">
      {showToast && (
        <CosmicToast
          message="Profile Updated!"
          type="success"
          duration={1500}
          onClose={() => setShowToast(false)}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-8 rounded-3xl bg-gray-50 border border-gray-200 shadow-xl space-y-6"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <Avatar
            name={localProfile.name}
            size={96}
            avatarUrl={localProfile.avatarUrl}
          />
          <label className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gray-900 cursor-pointer hover:bg-black transition flex items-center">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <Upload size={16} className="mr-2" /> Upload Avatar
          </label>
        </div>

        {/* Name */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <User size={16} className="mr-2" /> Username
          </label>
          <input
            title="Name"
            type="text"
            name="name"
            value={localProfile.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300"
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Mail size={16} className="mr-2" /> Email
          </label>
          <input
            title="Email"
            type="email"
            name="email"
            value={localProfile.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Tag size={16} className="mr-2" /> Bio / Tagline
          </label>
          <textarea
            title="Bio"
            name="tagline"
            value={localProfile.tagline}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 rounded-lg border border-gray-300"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 bg-white border rounded-xl"
          >
            <X size={20} className="inline mr-2" /> Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gray-900 text-white rounded-xl"
          >
            <Save size={20} className="inline mr-2" /> Save
          </button>
        </div>
      </form>
    </main>
  );
}