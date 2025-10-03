"use client";
import {
  Lock,
  Unlock,
  Image as ImgIcon,
  Smile,
  File as FileIcon,
} from "lucide-react";
import { Switch } from "@headlessui/react";
interface CapsuleToolbarProps {
  isPrivate: boolean;
  onPrivacyToggle: (val: boolean) => void;
}

const CapsuleToolbar: React.FC<CapsuleToolbarProps> = ({
  isPrivate,
  onPrivacyToggle,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
    <div className="flex items-center gap-3 text-gray-500 flex-wrap">
      <label
        htmlFor="file"
        className="cursor-pointer flex items-center gap-1 hover:text-blue-600"
      >
        <ImgIcon className="w-5 h-5" />
        <input
          id="file"
          type="file"
          className="hidden"
          aria-label="Attach file"
        />
      </label>
      <button
        type="button"
        aria-label="Attach file"
        className="hover:text-blue-600"
      >
        <FileIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Add mood"
        className="hover:text-blue-600"
      >
        <Smile className="w-5 h-5" />
      </button>
    </div>

    <div className="flex items-center gap-2 mt-2 sm:mt-0">
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
  </div>
);

export default CapsuleToolbar;
