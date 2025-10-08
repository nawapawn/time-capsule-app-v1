// src/app/profile/edit/page.tsx
"use client";

import React, { useState, useEffect } from "react"; // 💡 useState สำหรับ local state, useEffect สำหรับ cleanup
import { useRouter } from "next/navigation"; // สำหรับ redirect หน้าอื่น
import { Upload, User, Mail, Tag, Save, X } from "lucide-react"; // icons
import Avatar from "@/components/Avatar"; // component avatar
import CosmicToast from "@/components/CosmicToast"; // toast popup
import { useProfileStore, UserProfile } from "@/store/profileStore"; // store สำหรับ profile

export default function ProfileEditPage() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore(); // ดึง profile จาก store
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile); // state สำหรับ edit
  const [showToast, setShowToast] = useState(false); // toast popup state
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null); // 💡 เก็บ URL ชั่วคราวของ avatar

  // ==============================
  // Cleanup URL เก่าของ avatar
  // ==============================
  useEffect(() => {
    // ถ้ามี URL ชั่วคราวเก่า และมันไม่ใช่ avatar ใหม่ ให้ล้าง
    if (tempAvatarUrl && tempAvatarUrl !== localProfile.avatarUrl) {
      URL.revokeObjectURL(tempAvatarUrl);
      setTempAvatarUrl(null);
    }
  }, [localProfile.avatarUrl, tempAvatarUrl]);

  // cleanup เมื่อ component ถูก unmount
  useEffect(() => {
    return () => {
      if (tempAvatarUrl) URL.revokeObjectURL(tempAvatarUrl);
    };
  }, [tempAvatarUrl]);

  // ==============================
  // ฟังก์ชัน handle input change
  // ==============================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocalProfile((prev) => ({ ...prev, [name]: value })); // update field ตาม name
  };

  // ==============================
  // ฟังก์ชัน handle avatar upload
  // ==============================
  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newAvatarUrl = URL.createObjectURL(file); // 💡 สร้าง object URL ชั่วคราว
    setLocalProfile((prev) => ({ ...prev, avatarUrl: newAvatarUrl })); // update avatar ใน form
    setTempAvatarUrl(newAvatarUrl); // เก็บ URL ใหม่เพื่อ cleanup รอบต่อไป
  };

  // ==============================
  // ฟังก์ชัน submit form
  // ==============================
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(localProfile); // ✅ update store
    setShowToast(true); // แสดง toast

    // redirect หลัง 1.5 วินาที
    setTimeout(() => router.push("/profile"), 1500);

    // 💡 หมายเหตุ: ถ้าใช้ Object URL จริงต้องอัปโหลดไป server ก่อน
    // และเอา URL ของ server มา update แทน
  };

  // ==============================
  // ฟังก์ชัน cancel
  // ==============================
  const handleCancel = () => router.push("/profile");

  // ==============================
  // JSX
  // ==============================
  return (
    <main className="min-h-screen bg-white px-6 py-8">
      {/* Toast */}
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
        {/* Avatar Upload */}
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

        {/* Username */}
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
