"use client";
import React, { RefObject } from "react";
import Navbar from "@/components/Navbar";
import FeedCapsuleCard from "@/components/Home/FeedCapsuleCard";
import { useCapsule } from "@/context/CapsuleContext";

const SavedPage: React.FC = () => {
  const { savedData, toggleBookmark } = useCapsule();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center w-full px-4 py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          Saved Capsules
        </h1>
        {savedData.length === 0 ? (
          <p className="text-gray-400 text-lg text-center mt-10">
            You have no saved capsules yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl">
            {savedData.map((c) => {
              const shareRef: RefObject<HTMLButtonElement | null> =
                React.createRef();
              return (
                <FeedCapsuleCard
                  key={c.id}
                  capsule={c}
                  onBookmark={() => toggleBookmark(c)}
                  shareRef={shareRef}
                  size="small"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;
