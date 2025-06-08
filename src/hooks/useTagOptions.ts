import { useDirectoryStore } from "../store/useDirectoryStore";
import { type TagData } from "../types/tag";

export const useTagOptions = (): TagData[] => {
  const userDirectories = useDirectoryStore((state) =>
    state.getCurrentDirectories()
  );

  const tags: TagData[] = userDirectories
    .flatMap((dir) => dir.children ?? [])
    .map((child) => ({
      id: child.id,
      title: child.name,
      color: "#A1A1AA",
    }));

  return tags;
};
