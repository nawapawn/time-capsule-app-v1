"use client";

import React, { useState } from "react";
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
    setLocalProfile((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(localProfile); // ✅ อัปเดต store ตอน submit
    setShowToast(true);
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
