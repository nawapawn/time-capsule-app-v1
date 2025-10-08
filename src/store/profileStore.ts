import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserProfile = {
  name: string;
  email: string;
  tagline: string;
  avatarUrl: string;
};

interface ProfileState {
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Astronaut_393",
  email: "astro@example.com",
  tagline: "Exploring memories through time & space",
  avatarUrl: "",
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,

      updateProfile: (newProfile) =>
        set((state) => ({
          profile: { ...state.profile, ...newProfile },
        })),

      resetProfile: () => set({ profile: DEFAULT_PROFILE }),
    }),
    {
      name: "profile-storage",
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
