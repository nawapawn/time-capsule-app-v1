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

export default function CreateCapsuleForm({ onCreate, onClose }: CreateCapsuleFormProps) {
  const [isPrivate, setIsPrivate] = useState(true);
  const [mood, setMood] = useState<string>(moodOptions[0].name);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CapsuleFormValues>({
    resolver: zodResolver(capsuleSchema),
  });

  const onSubmit = (data: CapsuleFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const moodObject = moodOptions.find((m) => m.name === mood) || moodOptions[0];
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <Toaster position="top-center" />
      <div
        className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 flex flex-col gap-5 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center text-neutral-800 dark:text-neutral-100">
          Create Capsule
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {/* Title */}
          <input
            {...register("title")}
            placeholder="Title"
            className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-1 focus:ring-neutral-400 focus:outline-none"
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}

          {/* Content */}
          <textarea
            {...register("content")}
            rows={4}
            placeholder="Write something meaningful..."
            maxLength={1000}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-1 focus:ring-neutral-400 focus:outline-none resize-none"
          />
          {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}

          {/* Toolbar */}
          <CapsuleToolbar isPrivate={isPrivate} onPrivacyToggle={setIsPrivate} />

          {/* Mood */}
          <div className="flex flex-wrap gap-2 mt-1">
            {moodOptions.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => setMood(m.name)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
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
          {errors.openDate && <p className="text-xs text-red-500">{errors.openDate.message}</p>}

          {/* Image Upload */}
          <div className="flex items-center gap-3 mt-2">
            <label
              htmlFor="capsule-image"
              className="flex items-center justify-center w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <ImgIcon className="w-5 h-5 text-neutral-500" />
              <span className="sr-only">Attach an image</span>
            </label>
            <input
              id="capsule-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            {imageFile && (
              <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 transition"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
