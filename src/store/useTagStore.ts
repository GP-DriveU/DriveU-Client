import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type TagData } from "../types/tag";

interface TagState {
  tags: TagData[];
  setTags: (tags: TagData[]) => void;
  disabledTagIds: number[];
  setDisabledTagIds: (ids: number[]) => void;
}

export const useTagStore = create<TagState>()(
  persist(
    (set) => ({
      tags: [],
      setTags: (tags) => set({ tags }),
      disabledTagIds: [],
      setDisabledTagIds: (ids) => set({ disabledTagIds: ids }),
    }),
    {
      name: "tag-storage",
    }
  )
);
