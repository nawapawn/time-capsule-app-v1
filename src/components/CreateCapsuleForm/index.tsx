"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Send } from "lucide-react";
import Image from "next/image";
import MoodPicker from "./MoodPicker";
import CapsuleToolbar from "./CapsuleToolbar";

const capsuleSchema = z.object({
  title: z.string().nonempty("Please enter the capsule title."),
  content: z.string().nonempty("Please write a message to your future self."),
  openDate: z.string().refine((val) => {
    if (typeof window === "undefined") return true;
    return new Date(val) > new Date();
  }, "The date and time must be in the future."),
});

type CapsuleFormValues = z.infer<typeof capsuleSchema>;

interface CreateCapsuleFormProps {
  onCreationSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateCapsuleForm({ onCreationSuccess, onClose }: CreateCapsuleFormProps) {
  const [isPrivate, setIsPrivate] = useState(true);
  const [mood, setMood] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<CapsuleFormValues>({ resolver: zodResolver(capsuleSchema) });

  const handleMoodToggle = (selectedMood: string) => {
    setMood((prev) =>
      prev.includes(selectedMood)
        ? prev.filter((m) => m !== selectedMood)
        : [...prev, selectedMood]
    );
  };

  const onSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const success = true;
      if (success) {
        toast.custom(() => (
          <div className="max-w-md w-full bg-indigo-600 shadow-lg rounded-xl pointer-events-auto flex items-center p-4 gap-4 text-white">
            {typeof window !== "undefined" && (
              <Image src="/1492719123-rocket_83625.png" alt="Rocket Success" width={48} height={48} />
            )}
            <span className="font-semibold">Your Time Capsule has been successfully created!</span>
          </div>
        ), { duration: 4000 });

        reset(); setMood([]); setIsPrivate(true);
        onCreationSuccess?.();
      } else toast.error("Failed to create Time Capsule.");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6" onClick={onClose}>
      <Toaster position="top-center" />
      <div className="w-full max-w-lg sm:max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl relative p-4 sm:p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
          What&apos;s happening?
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:gap-4 md:gap-6" noValidate>
          <input {...register("title")} placeholder="Capsule title..." className="w-full p-2 sm:p-3 border-b border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none rounded-md text-sm sm:text-base" />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}

          <textarea {...register("content")} rows={3} maxLength={1000} placeholder="Write your message..." className="w-full resize-none p-2 sm:p-3 border-b border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none rounded-md text-sm sm:text-base" />
          {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}

          <CapsuleToolbar isPrivate={isPrivate} onPrivacyToggle={setIsPrivate} />

          <MoodPicker selectedMood={mood} onToggleMood={handleMoodToggle} />

          <input {...register("openDate")} type="datetime-local" className="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-sm sm:text-base" />
          {errors.openDate && <p className="text-xs text-red-500">{errors.openDate.message}</p>}

          <div className="relative mt-4">
            <button type="submit" onClick={() => setDropdownOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition bg-black text-white hover:brightness-110 text-sm sm:text-base">
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
              Create Capsule
            </button>

            <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)} aria-label="Open options" className="absolute right-2 top-2 text-gray-700 dark:text-gray-200">▾</button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg z-10">
                <button type="button" className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Save Draft</button>
                <button type="button" className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Schedule for later</button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
