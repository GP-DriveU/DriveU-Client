import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useDirectoryStore } from "@/store/useDirectoryStore";
import { useSemesterStore } from "@/store/useSemesterStore";
import { useStorageStore } from "@/store/useStorageStore";
import { updateDirectoryParent, updateDirectoriesOrder } from "@/api/Directory";
import { useShallow } from "zustand/shallow";

export const useSidebar = () => {
  const location = useLocation();
  const { selectedSemesterKey } = useSemesterStore();
  const { totalStorage, remainingStorage } = useStorageStore();
  const { updateDirectoryOrder, moveDirectory } = useDirectoryStore();

  const currentSemesterId =
    useSemesterStore().getCurrentSemester()?.userSemesterId;

  const { year, term } = useMemo(() => {
    if (!selectedSemesterKey) return { year: 0, term: "" };
    const [yearStr, termStr] = selectedSemesterKey.split("-");
    return { year: Number(yearStr), term: termStr };
  }, [selectedSemesterKey]);

  const currentDirectories = useDirectoryStore(
    useShallow((state) => state.getDirectoriesBySemester(year, term))
  );

  const { usedStorage, usagePercentage } = useMemo(() => {
    const safeTotal = Math.max(totalStorage, 1);
    const safeRemaining = Math.min(remainingStorage, safeTotal);
    const used = safeTotal - safeRemaining;
    const percentage = (used / safeTotal) * 100;

    return {
      usedStorage: used,
      usagePercentage: Math.max(0, Math.min(100, percentage)),
    };
  }, [totalStorage, remainingStorage]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findItemAndParent = (slug: string) => {
    for (const dir of currentDirectories) {
      const item = (dir.children ?? []).find(
        (child) => `${encodeURIComponent(child.name)}-${child.id}` === slug
      );
      if (item) return { item, parentId: dir.id };
    }
    return null;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !year || !term) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeItemData = findItemAndParent(activeId);
    if (!activeItemData) return;

    const { item: activeItem, parentId: oldParentId } = activeItemData;
    const overItemData = findItemAndParent(overId);

    if (overItemData) {
      const { parentId: newParentId } = overItemData;

      if (oldParentId === newParentId) {
        const parentDir = currentDirectories.find((d) => d.id === oldParentId);
        if (!parentDir) return;

        const oldIndex = parentDir.children.findIndex(
          (c) => c.id === activeItem.id
        );
        const newIndex = parentDir.children.findIndex(
          (c) => c.id === overItemData.item.id
        );

        const previousChildren = [...parentDir.children];
        const newChildren = arrayMove(parentDir.children, oldIndex, newIndex);
        const newChildrenForStore = newChildren.map((child, index) => ({
          ...child,
          order: index,
        }));

        updateDirectoryOrder(year, term, oldParentId, newChildrenForStore);

        try {
          if (!currentSemesterId) throw new Error("학기 정보 없음");
          await updateDirectoriesOrder({
            parentDirectoryId: oldParentId,
            updates: newChildrenForStore.map((item) => ({
              directoryId: item.id,
              order: item.order,
            })),
          });
        } catch (error) {
          console.error("순서 변경 실패:", error);
          updateDirectoryOrder(year, term, oldParentId, previousChildren);
        }
      } else {
        moveDirectory(year, term, activeItem.id, oldParentId, newParentId);
        try {
          await updateDirectoryParent(activeItem.id, { newParentId });
        } catch (error) {
          console.error("부모 변경 실패:", error);
          moveDirectory(year, term, activeItem.id, newParentId, oldParentId);
        }
      }
      return;
    }

    if (overId.startsWith("group-")) {
      const newParentId = Number(overId.split("-")[1]);
      if (oldParentId === newParentId) return;

      moveDirectory(year, term, activeItem.id, oldParentId, newParentId);
      try {
        await updateDirectoryParent(activeItem.id, { newParentId });
      } catch (error) {
        console.error("부모 변경 실패:", error);
        moveDirectory(year, term, activeItem.id, newParentId, oldParentId);
      }
    }
  };

  const menuGroups = currentDirectories
    .map((dir) => {
      const routeMap: Record<string, { slug: string; emoji: string }> = {
        학업: { slug: "study", emoji: "🏫" },
        과목: { slug: "subject", emoji: "📚" },
        대외활동: { slug: "activity", emoji: "📢" },
      };

      const route = routeMap[dir.name];
      if (!route) return null;

      return {
        id: dir.id,
        title: `${route.emoji} ${dir.name}`,
        basePath: `/${route.slug}`,
        items: (dir.children ?? []).map((child) => ({
          ...child,
          slug: `${encodeURIComponent(child.name)}-${child.id}`,
        })),
      };
    })
    .filter((group) => group !== null);

  return {
    sensors,
    handleDragEnd,
    menuGroups,
    storage: {
      total: totalStorage,
      used: usedStorage,
      percentage: usagePercentage,
    },
    pathInfo: {
      currentPath: location.pathname,
      isHome: location.pathname === "/",
      isTrash: location.pathname === "/trash",
      isStore: location.pathname === "/store",
    },
  };
};
