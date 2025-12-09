import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDirectoryStore } from "@/store/useDirectoryStore";
import { useSemesterStore } from "@/store/useSemesterStore";
import { useTagOptions } from "@/hooks/useTagOptions";
import { getResourcesByDirectory } from "@/api/File";
import { type Item } from "@/types/Item";
import { type FileSortField, type SortOption } from "@/types/sort";

const DEFAULT_SORT: SortOption<FileSortField> = {
  field: "createdAt",
  order: "desc",
};
const DEFAULT_FAV_FILTER = ["all"];
const DEFAULT_LINK_FILTER = ["ALL"];

export const useFilePageData = () => {
  const params = useParams();
  const location = useLocation();
  const { selectedSemesterKey } = useSemesterStore();
  const { getDirectoriesBySemester } = useDirectoryStore();

  const [sortOption, setSortOption] =
    useState<SortOption<FileSortField>>(DEFAULT_SORT);
  const [favoriteFilter, setFavoriteFilter] =
    useState<string[]>(DEFAULT_FAV_FILTER);
  const [linkTypeFilter, setLinkTypeFilter] =
    useState<string[]>(DEFAULT_LINK_FILTER);

  const { year, term } = useMemo(() => {
    if (!selectedSemesterKey) return { year: 0, term: "" };
    const [y, t] = selectedSemesterKey.split("-");
    return { year: Number(y), term: t };
  }, [selectedSemesterKey]);

  const currentDirs = getDirectoriesBySemester(year, term);

  const slug = params.slug ?? "";
  const slugParts = slug.split("-");
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const slugPrefix =
    pathSegments.length >= 2 ? pathSegments[pathSegments.length - 2] : "";
  const category = params.slug?.replace(/-\d+$/, "") ?? "파일";

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

  const [rawItems, setRawItems] = useState<Item[]>([]);

  useEffect(() => {
    setSortOption(DEFAULT_SORT);
    setFavoriteFilter(DEFAULT_FAV_FILTER);
    setLinkTypeFilter(DEFAULT_LINK_FILTER);
  }, [directoryId]);

  const fetchResources = useCallback(async () => {
    if (!directoryId) return;

    try {
      const sortParam = `${sortOption.field},${sortOption.order}`;
      const isFavoriteOnly = favoriteFilter.includes("favorite");

      const response = await getResourcesByDirectory(directoryId, {
        sort: sortParam,
        favoriteOnly: isFavoriteOnly,
      });

      const mappedResponse = response.map((item: any) => {
        const isLink = item.type === "LINK";
        const isFile = !!item.extension;
        return {
          ...item,
          type: isLink ? "LINK" : item.type,
          iconType: isLink ? item.iconType : isFile ? "FILE" : "NOTE",
        };
      });
      setRawItems(mappedResponse);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  }, [directoryId, sortOption, favoriteFilter]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const items = useMemo(() => {
    if (linkTypeFilter.includes("ALL")) return rawItems;

    return rawItems.filter((item) => {
      return linkTypeFilter.includes(item.iconType);
    });
  }, [rawItems, linkTypeFilter]);

  return {
    category,
    selectedSemesterKey,
    directoryId,
    tagOptions,
    baseDir,
    items,
    rawItems,
    setItems: setRawItems,
    sortOption,
    setSortOption,
    favoriteFilter,
    setFavoriteFilter,
    linkTypeFilter,
    setLinkTypeFilter,
  };
};
