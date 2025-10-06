import { create } from "zustand";

export type UserProfile = {
  name: string;
  email: string;
  tagline: string;
  avatarUrl: string;
};

interface ProfileState {
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: {
    name: "Astronaut_393",
    email: "astro@example.com",
    tagline: "Exploring memories through time & space",
    avatarUrl: "",
  },
  updateProfile: (newProfile) =>
    set((state) => ({ profile: { ...state.profile, ...newProfile } })),
}));
