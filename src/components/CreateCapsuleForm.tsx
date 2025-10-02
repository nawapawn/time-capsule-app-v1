'use client';
import React, { useState } from 'react';
import { Calendar, X, Lock, Unlock, Loader2, Send } from 'lucide-react';

const moodOptions = ['😊 Happy', '😢 Sad', '🤩 Excited', '😌 Calm', '😠 Angry', '😴 Tired'];
const categoryOptions = ['Personal', 'Future Goals', 'Message to Myself', 'Dreams', 'Family', 'Work/Study'];

interface CreateCapsuleFormProps {
  onCreationSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateCapsuleForm({ onCreationSuccess, onClose }: CreateCapsuleFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [openDate, setOpenDate] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [mood, setMood] = useState('');
  const [category, setCategory] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validateDate = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    return selected > today;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDate(openDate)) {
      setModalMessage('⚠️ กรุณาเลือกวันที่เปิดแคปซูลที่เป็นอนาคต');
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setModalMessage('🎉 แคปซูลเวลาของคุณถูกสร้างเรียบร้อยแล้ว!');
      setIsSuccess(true);
      setShowModal(true);

      setTitle('');
      setContent('');
      setOpenDate('');
      setMood('');
      setCategory('');
      setAttachmentFile(null);
      setIsPrivate(true);
      if (onCreationSuccess) onCreationSuccess();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <style>
        {`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      <div
        className="w-[90vw] max-w-[1200px] h-[80vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl relative flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            title="ปิด"
            aria-label="ปิด"
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Form Column */}
        <div className="flex-1 p-8 overflow-y-auto hide-scrollbar">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            สร้างแคปซูลเวลาของคุณ
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-2">
              <label htmlFor="capsule-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                หัวข้อแคปซูล <span className="text-red-500">*</span>
              </label>
              <input
                id="capsule-title"
                type="text"
                required
                title="หัวข้อแคปซูล"
                placeholder="หัวข้อแคปซูลของคุณ..."
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Content */}
            <div className="col-span-2">
              <label htmlFor="capsule-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ข้อความถึงตัวคุณในอนาคต <span className="text-red-500">*</span>
              </label>
              <textarea
                id="capsule-content"
                required
                title="ข้อความถึงตัวคุณในอนาคต"
                placeholder="เขียนข้อความ ความหวัง หรือเป้าหมายของคุณ..."
                rows={5}
                maxLength={1000}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                {content.length}/1000 ตัวอักษร
              </p>
            </div>

            {/* Open Date */}
            <div>
              <label htmlFor="capsule-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-500" /> วันที่เปิดแคปซูล
              </label>
              <input
                id="capsule-date"
                type="date"
                required
                title="วันที่เปิดแคปซูล"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                value={openDate}
                onChange={(e) => setOpenDate(e.target.value)}
              />
              {openDate && !validateDate(openDate) && (
                <p className="text-xs text-red-500 mt-1">ต้องเป็นวันที่ในอนาคต</p>
              )}
            </div>

            {/* Privacy Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ความเป็นส่วนตัว
              </label>
              <div className="flex items-center gap-3 mt-1">
                <div
                  className={`w-14 h-7 flex items-center rounded-full p-1 transition cursor-pointer ${isPrivate ? 'bg-blue-600' : 'bg-gray-300'}`}
                  onClick={() => setIsPrivate(!isPrivate)}
                  title={isPrivate ? "ส่วนตัว" : "สาธารณะ"}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${isPrivate ? 'translate-x-7' : ''}`}
                  />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  {isPrivate ? (
                    <>
                      <Lock className="w-4 h-4 text-blue-600" /> ส่วนตัว
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-gray-500" /> สาธารณะ
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Mood */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">อารมณ์ในวันนี้</label>
              <div className="flex gap-2 flex-wrap">
                {moodOptions.map((m, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setMood(m)}
                    title={m}
                    className={`px-3 py-1.5 rounded-full border text-sm transition font-medium ${
                      mood === m
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">หมวดหมู่</label>
              <div className="flex gap-2 flex-wrap">
                {categoryOptions.map((c, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setCategory(c)}
                    title={c}
                    className={`px-3 py-1.5 rounded-full border text-sm transition font-medium ${
                      category === c
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* File */}
            <div className="col-span-2">
              <label htmlFor="capsule-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">แนบไฟล์</label>
              <input
                id="capsule-file"
                type="file"
                title="แนบไฟล์"
                aria-label="แนบไฟล์"
                onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-100"
              />
              {attachmentFile && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{attachmentFile.name}</p>}
            </div>

            {/* Submit */}
            <div className="col-span-2 text-center mt-4">
              <button
                type="submit"
                title="สร้างแคปซูลเวลา"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
              >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                สร้างแคปซูล
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-[90vw] max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className={`text-center text-lg ${isSuccess ? 'text-green-600' : 'text-red-500'}`}>
              {modalMessage}
            </p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowModal(false)}
                title="ปิดโมดอล"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
