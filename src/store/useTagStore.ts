import { create } from "zustand";
import { type TagData } from "../types/tag";

interface TagState {
  tags: TagData[];
  setTags: (tags: TagData[]) => void;
}

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  setTags: (tags) => set({ tags }),
}));
