"use client";

import { Lock, Unlock } from "lucide-react"; // ไอคอน Lock/Unlock
import { Switch } from "@headlessui/react"; // UI Switch component

// Props สำหรับ CapsuleToolbar
interface CapsuleToolbarProps {
  isPrivate: boolean; // state ของ privacy (true = private, false = public)
  onPrivacyToggle: (val: boolean) => void; // callback เมื่อ toggle privacy
}

const CapsuleToolbar: React.FC<CapsuleToolbarProps> = ({
  isPrivate,
  onPrivacyToggle,
}) => (
  // Container ของ toolbar จัดด้านขวา
  <div className="flex justify-end items-center gap-2">
    {/* 🔹 Switch component จาก Headless UI */}
    <Switch
      checked={isPrivate} // state ของ switch
      onChange={onPrivacyToggle} // callback เมื่อ toggle
      className={`${
        isPrivate ? "bg-blue-600" : "bg-gray-300" // สี background ตาม state
      } relative inline-flex h-5 w-10 items-center rounded-full`} // layout switch
    >
      {/* 🔹 ตัววงกลมเลื่อน */}
      <span
        className={`inline-block h-4 w-4 transform bg-white rounded-full transition ${
          isPrivate ? "translate-x-5" : "translate-x-1" // เลื่อนตำแหน่งตาม state
        }`}
      />
    </Switch>

    {/* 🔹 Icon แสดงสถานะ privacy */}
    {isPrivate ? (
      <Lock className="w-4 h-4 text-blue-600" /> // ถ้า private แสดง lock
    ) : (
      <Unlock className="w-4 h-4 text-gray-500" /> // ถ้า public แสดง unlock
    )}
  </div>
);

export default CapsuleToolbar;
