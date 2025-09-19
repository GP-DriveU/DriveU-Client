import { useTagStore } from "@/store/useTagStore";
import { type TagData } from "@/types/tag";

export const useTagOptions = (): TagData[] => {
  const tags = useTagStore((state) => state.tags);
  return tags;
};
