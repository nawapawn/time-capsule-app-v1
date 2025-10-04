// src/components/CreateCapsuleForm/CapsuleToolbar.tsx
"use client";
import { Lock, Unlock } from "lucide-react";
import { Switch } from "@headlessui/react";

interface CapsuleToolbarProps {
  isPrivate: boolean;
  onPrivacyToggle: (val: boolean) => void;
}

const CapsuleToolbar: React.FC<CapsuleToolbarProps> = ({
  isPrivate,
  onPrivacyToggle,
}) => (
  <div className="flex justify-end items-center gap-2">
    <Switch
      checked={isPrivate}
      onChange={onPrivacyToggle}
      className={`${
        isPrivate ? "bg-blue-600" : "bg-gray-300"
      } relative inline-flex h-5 w-10 items-center rounded-full`}
    >
      <span
        className={`inline-block h-4 w-4 transform bg-white rounded-full transition ${
          isPrivate ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </Switch>
    {isPrivate ? (
      <Lock className="w-4 h-4 text-blue-600" />
    ) : (
      <Unlock className="w-4 h-4 text-gray-500" />
    )}
  </div>
);

export default CapsuleToolbar;
