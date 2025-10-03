"use client";
import React, { useState } from "react";

interface Props {
  capsuleId: number;
  shareRef: React.RefObject<HTMLButtonElement>;
}

const ShareButton: React.FC<Props> = ({ capsuleId, shareRef }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const link = `${window.location.origin}/capsule/${capsuleId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={shareRef}
        onClick={handleCopy}
        className="hover:text-blue-500 transition-colors"
        title="Share"
        aria-label="Share"
      >
        Share
      </button>
      {copied && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-md animate-fade-up">
          Copied!
        </span>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(4px); }
          50% { opacity: 1; transform: translateY(-2px); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        .animate-fade-up {
          animation: fadeUp 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ShareButton;
