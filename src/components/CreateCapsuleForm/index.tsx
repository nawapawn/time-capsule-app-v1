"use client";
import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Send, Image as ImgIcon, Trash2 } from "lucide-react";
import CapsuleToolbar from "./CapsuleToolbar"; // Assume this component exists
import { CapsuleType, moodOptions } from "@/utils/capsuleUtils"; // Assume this utility file exists
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";

// --- Zod Schema for Validation ---
const capsuleSchema = z.object({
  title: z.string().nonempty("Please enter the capsule title."),
  content: z.string().nonempty("Please write a message to your future self."),
  openDate: z
    .string()
    .refine(
      (val) => typeof window === "undefined" || new Date(val) > new Date(),
      "The date and time must be in the future."
    ),
});

type CapsuleFormValues = z.infer<typeof capsuleSchema>;

// --- Component Props Type ---
interface CreateCapsuleFormProps {
  // ฟังก์ชันนี้จะถูกเรียกเมื่อสร้างแคปซูลสำเร็จ และส่งข้อมูลแคปซูลใหม่กลับไป
  onCreate?: (capsule: CapsuleType) => void; 
  onClose?: () => void;
}

export default function CreateCapsuleForm({
  onCreate,
  onClose,
}: CreateCapsuleFormProps) {
  const [isPrivate, setIsPrivate] = useState(true);
  const [mood, setMood] = useState<string>(moodOptions[0].name);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- React Hook Form Setup ---
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CapsuleFormValues>({
    resolver: zodResolver(capsuleSchema),
  });

  // --- Image Upload (Dropzone) ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setImageFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // --- Form Submission Logic ---
  const onSubmit = (data: CapsuleFormValues) => {
    setIsLoading(true);
    
    // จำลองการเรียก API ด้วย setTimeout
    setTimeout(() => {
      setIsLoading(false);
      
      const moodObject =
        moodOptions.find((m) => m.name === mood) || moodOptions[0];
      
      const imageSrc = imageFile
        ? URL.createObjectURL(imageFile)
        : `https://picsum.photos/seed/${Date.now()}/600/400`;

      // สร้างวัตถุแคปซูลใหม่
      const newCapsule: CapsuleType = {
        id: Date.now(),
        title: data.title,
        content: data.content, // เพิ่ม content เข้าไปใน CapsuleType
        unlockAt: new Date(data.openDate).toISOString(), // (สำหรับ ProfilePage.tsx เดิม)
        targetDate: new Date(data.openDate), // สำหรับ Timeline
        visibility: isPrivate ? 'Private' : 'Public', // เพิ่ม visibility
        creator: "You",
        creatorAvatar: "https://i.pravatar.cc/150?img=68",
        imageSrc,
        mood: moodObject,
        views: 0,
        bookmarked: false,
      };

      // 💥 เรียกฟังก์ชัน onCreate เพื่ออัปเดต State ในหน้า ProfilePage
      onCreate?.(newCapsule); 
      
      toast.success("Your Time Capsule has been created!");
      reset();
      setMood(moodOptions[0].name);
      setIsPrivate(true);
      setImageFile(null);
      onClose?.(); // ปิด Modal
    }, 1000);
  };

  // --- JSX Rendering ---
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Toaster position="top-center" />
        <motion.div
          className="w-full sm:max-w-lg bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 flex flex-col gap-5 shadow-lg"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 0.25 } }}
          exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
        >
          <h2 className="text-xl font-semibold text-center text-neutral-800 dark:text-neutral-100">
            Create Capsule
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Title */}
            <input
              {...register("title")}
              placeholder="Title"
              className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-1 focus:ring-neutral-400 focus:outline-none"
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}

            {/* Content */}
            <textarea
              {...register("content")}
              rows={4}
              placeholder="Write something meaningful..."
              maxLength={1000}
              className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-1 focus:ring-neutral-400 focus:outline-none resize-none"
            />
            {errors.content && (
              <p className="text-xs text-red-500">{errors.content.message}</p>
            )}

            {/* Toolbar (Privacy Toggle) */}
            <CapsuleToolbar
              isPrivate={isPrivate}
              onPrivacyToggle={setIsPrivate}
            />

            {/* Mood Selection */}
            <div className="flex flex-wrap gap-2 mt-1 overflow-x-auto">
              {moodOptions.map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setMood(m.name)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0 transition-all ${
                    mood === m.name
                      ? "bg-neutral-800 text-white dark:bg-white dark:text-neutral-900"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {m.emoji} {m.name}
                </button>
              ))}
            </div>

            {/* Open Date */}
            <input
              {...register("openDate")}
              type="datetime-local"
              className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-neutral-400 focus:outline-none"
            />
            {errors.openDate && (
              <p className="text-xs text-red-500">{errors.openDate.message}</p>
            )}

            {/* Image Upload Drag & Drop */}
            <div
              {...getRootProps()}
              className={`flex items-center gap-3 mt-2 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              }`}
            >
              <input {...getInputProps()} />
              <ImgIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-200" />
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                {imageFile ? "Change Image" : "Drag & drop an image or click"}
              </span>
              {imageFile && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageFile(null);
                  }}
                  className="ml-auto p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition"
                  aria-label="Remove image"
                >
                  <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                </button>
              )}
            </div>
            {imageFile && (
              <div className="w-full h-48 relative mt-2 rounded-lg overflow-hidden">
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Create
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}