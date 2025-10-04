"use client";
import React from "react";
import Image from "next/image";

interface ProfileAvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ src, alt = "User Avatar", size = 32, className }) => {
  return (
    <Image
      src={src || "/default_avatar.png"}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full border border-gray-200 object-cover ${className || ""}`}
      unoptimized // สำคัญมากสำหรับ dynamic URLs
    />
  );
};

export default ProfileAvatar;
