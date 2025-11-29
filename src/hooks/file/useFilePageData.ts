import { useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDirectoryStore } from "@/store/useDirectoryStore";
import { useSemesterStore } from "@/store/useSemesterStore";
import { useTagOptions } from "@/hooks/useTagOptions";
import { getResourcesByDirectory } from "@/api/File";
import { type Item } from "@/types/Item";

export const useFilePageData = () => {
  const params = useParams();
  const location = useLocation();
  const { selectedSemesterKey } = useSemesterStore();
  const { getCurrentDirectories } = useDirectoryStore.getState();

  const slug = params.slug ?? "";
  const slugParts = slug.split("-");
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const slugPrefix = pathSegments[pathSegments.length - 2];
  const category = params.slug?.replace(/-\d+$/, "") ?? "파일";
  const currentDirs = getCurrentDirectories();

  const resolveDirectoryId = (prefix: string, id: number): number => {
    const map: Record<string, string> = { study: "학업", subject: "과목" };
    const translated = map[prefix];
    if (!translated) return id;
    const baseDir = currentDirs.find((dir) => dir.name === translated);
    return baseDir?.children?.find((child) => child.id === id)?.id ?? id;
  };

  const directoryId = resolveDirectoryId(slugPrefix, Number(slugParts[1]));

  const baseDir = currentDirs.find((dir) => {
    const map: Record<string, string> = {
      study: "학업",
      subject: "과목",
      activity: "대외활동",
    };
    return dir.name === map[slugPrefix];
  });
  const allTags = useTagOptions();
  const tagOptions = allTags.filter(
    (tag) => tag.parentDirectoryId !== baseDir?.id
  );

  const [items, setItems] = useState<Item[]>([]);

  const fetchResources = useCallback(async () => {
    try {
      const response = await getResourcesByDirectory(directoryId);
      const mappedResponse = response.map((item: any) => {
        const isLink = item.type === "LINK";
        const isFile = !!item.extension;
        return {
          ...item,
          type: isLink ? "LINK" : item.type,
          iconType: isLink ? "LINK" : isFile ? "FILE" : "NOTE",
        };
      });
      setItems(mappedResponse);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  }, [directoryId]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    if (location.state?.openFab) {
      setItems((prev) => prev.map((item) => ({ ...item, isSelected: false })));
    }
  }, [location.state]);

  return {
    category,
    selectedSemesterKey,
    directoryId,
    tagOptions,
    baseDir,
    items,
    setItems,
  };
};
