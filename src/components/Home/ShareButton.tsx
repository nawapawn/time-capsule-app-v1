// src/components/Home/ShareButton.tsx
"use client";
import React, { useState, RefObject } from "react";

interface Props {
  capsuleId: number;
  shareRef: RefObject<HTMLButtonElement | null>;
}

const ShareButton: React.FC<Props> = ({ capsuleId, shareRef }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/capsule/${capsuleId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-block">
      <button ref={shareRef ?? undefined} onClick={handleCopy} className="hover:text-blue-500 transition-colors">Share</button>
      {copied && <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-md animate-fade-up">Copied!</span>}
    </div>
  );
};

export default ShareButton;
