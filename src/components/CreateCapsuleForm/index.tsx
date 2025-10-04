"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Send, Image as ImgIcon } from "lucide-react";
import CapsuleToolbar from "./CapsuleToolbar";
import { CapsuleType, moodOptions } from "@/utils/capsuleUtils";
import Image from "next/image";

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

interface CreateCapsuleFormProps {
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CapsuleFormValues>({
    resolver: zodResolver(capsuleSchema),
  });

  const onSubmit = (data: CapsuleFormValues) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const moodObject =
        moodOptions.find((m) => m.name === mood) || moodOptions[0];
      const imageSrc = imageFile
        ? URL.createObjectURL(imageFile)
        : `https://picsum.photos/seed/${Date.now()}/600/400`;

      const newCapsule: CapsuleType = {
        id: Date.now(),
        title: data.title,
        creator: "You",
        creatorAvatar: "https://i.pravatar.cc/150?img=68",
        imageSrc,
        mood: moodObject,
        targetDate: new Date(data.openDate),
        views: 0,
        bookmarked: false,
      };

      onCreate?.(newCapsule);
      toast.success("Your Time Capsule has been created!");

      reset();
      setMood(moodOptions[0].name);
      setIsPrivate(true);
      setImageFile(null);
      onClose?.();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
      onClick={onClose}
    >
      <Toaster position="top-center" />
      <div
        className="w-full max-w-lg sm:max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl relative p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
          What&apos;s happening?
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          {/* Title */}
          <label htmlFor="capsule-title" className="sr-only">
            Capsule Title
          </label>
          <input
            {...register("title")}
            id="capsule-title"
            placeholder="Capsule title..."
            className="w-full p-2 border-b border-gray-300 dark:border-gray-700 bg-transparent rounded-md"
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}

          {/* Content */}
          <label htmlFor="capsule-content" className="sr-only">
            Capsule Message
          </label>
          <textarea
            {...register("content")}
            id="capsule-content"
            rows={3}
            maxLength={1000}
            placeholder="Write your message..."
            className="w-full p-2 border-b border-gray-300 dark:border-gray-700 bg-transparent rounded-md resize-none"
          />
          {errors.content && (
            <p className="text-xs text-red-500">{errors.content.message}</p>
          )}

          {/* Toolbar */}
          <CapsuleToolbar
            isPrivate={isPrivate}
            onPrivacyToggle={setIsPrivate}
          />

          {/* Mood selection */}
          <div className="flex flex-wrap gap-2 mt-2">
            {moodOptions.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => setMood(m.name)}
                className={`px-3 py-2 rounded-md font-semibold text-sm ${
                  mood === m.name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {m.emoji} {m.name}
              </button>
            ))}
          </div>

          {/* Open date */}
          <label htmlFor="capsule-date" className="sr-only">
            Open Date
          </label>
          <input
            {...register("openDate")}
            id="capsule-date"
            type="datetime-local"
            className="w-full p-2 border rounded-md bg-transparent mt-2"
          />
          {errors.openDate && (
            <p className="text-xs text-red-500">{errors.openDate.message}</p>
          )}

          {/* Image upload with lucide icon and accessible label */}
          <div className="mt-2 flex items-center gap-4">
            <label
              htmlFor="capsule-image"
              className="flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <ImgIcon className="w-6 h-6 text-gray-500 hover:text-blue-600" />
              <span className="sr-only">Attach an image</span>
            </label>

            <input
              id="capsule-image"
              type="file"
              accept="image/*"
              className="hidden"
              aria-label="Attach an image"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />

            {/* Preview */}
            {imageFile && (
              <div className="w-32 h-32 relative rounded-md overflow-hidden">
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview of uploaded image"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-black text-white font-semibold mt-4"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            Create Capsule
          </button>
        </form>
      </div>
    </div>
  );
}
