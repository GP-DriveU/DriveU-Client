import { useLocation } from "react-router-dom";
import { useDirectoryStore } from "@/store/useDirectoryStore";
import { IconHome, IconStore, IconTrash } from "@/assets";
import SidebarItem from "@/commons/layout/sidebar/SideBarItem";
import SidebarGroup from "@/commons/layout/sidebar/SideBarGroup";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { updateDirectoryParent, updateDirectoriesOrder } from "@/api/Directory";
import { useSemesterStore } from "@/store/useSemesterStore";

function Sidebar() {
  const location = useLocation();
  const { getCurrentDirectories, updateDirectoryOrder, moveDirectory } =
    useDirectoryStore();
  const currentSemesterId =
    useSemesterStore().getCurrentSemester()?.userSemesterId;

  const currentDirectories = getCurrentDirectories();

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
      if (item) {
        return { item, parentId: dir.id };
      }
    }
    return null;
  };

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeItemData = findItemAndParent(activeId);
    if (!activeItemData) return;

    const { item: activeItem, parentId: oldParentId } = activeItemData;
    const overItemData = findItemAndParent(overId);

    if (overItemData) {
      const { parentId: newParentId } = overItemData;

      if (oldParentId === newParentId) {
        const parentId = activeItemData.parentId;
        const parentDir = currentDirectories.find((d) => d.id === parentId);
        if (!parentDir) return;

        const oldIndex = parentDir.children.findIndex(
          (c) => c.id === activeItemData.item.id
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
        updateDirectoryOrder(parentId, newChildrenForStore);

        try {
          if (!currentSemesterId) throw new Error("학기 정보가 없습니다.");
          const updates = newChildrenForStore.map((item) => ({
            directoryId: item.id,
            order: item.order,
          }));
          await updateDirectoriesOrder({
            parentDirectoryId: parentId,
            updates,
          });
        } catch (error) {
          console.error("순서 변경 API 호출 실패:", error);
          updateDirectoryOrder(parentId, previousChildren);
        }
      }
      else {
        const activeItemId = activeItemData.item.id;
        const oldParentId = activeItemData.parentId;
        const newParentId = overItemData.parentId;

        moveDirectory(activeItemId, oldParentId, newParentId);

        try {
          await updateDirectoryParent(activeItemId, { newParentId });
        } catch (error) {
          console.error("부모 변경 API 호출 실패:", error);
          moveDirectory(activeItemId, newParentId, oldParentId);
        }
      }
      return;
    }
    if (overId.startsWith("group-")) {
      const newParentId = Number(overId.split("-")[1]);

      if (oldParentId === newParentId) return;

      console.log(
        `(그룹 이동) ${activeItem.id}번 아이템을 ${oldParentId} -> ${newParentId} 그룹으로 이동`
      );

      moveDirectory(activeItem.id, oldParentId, newParentId);

      try {
        await updateDirectoryParent(activeItem.id, { newParentId });
      } catch (error) {
        console.error("부모 변경 API 호출 실패:", error);
        moveDirectory(activeItem.id, newParentId, oldParentId);
      }
    }
  }

  if (currentDirectories.length === 0) {
    return (
      <aside className="w-[278px] min-w-[220px] min-h-screen px-10 py-6 bg-primary_light flex flex-col gap-4">
        <div className="text-center text-font">학기 정보가 없습니다.</div>
      </aside>
    );
  }

  const isHome = location.pathname === "/";
  const isTrash = location.pathname === "/trash";

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <aside className="w-[278px] min-w-[220px] min-h-screen px-10 py-6 bg-primary_light flex flex-col gap-4">
        <div className="flex-shrink-0 mb-6 flex flex-col gap-3">
        <div
          className={`flex flex-row items-center mb-6 ${
            isHome ? "bg-primary text-white" : ""
          }`}
        >
          <IconHome className={`${isHome ? "text-white" : ""}`} />
          <SidebarItem label="전체보기" isActive={isHome} to={"/"} />
        </div>
          {(() => {
            const grouped = currentDirectories.map((dir) => {
            const routeMap: Record<string, { slug: string; emoji: string }> = {
              학업: { slug: "study", emoji: "🏫" },
              과목: { slug: "subject", emoji: "📚" },
              대외활동: { slug: "activity", emoji: "📢" },
            };

            const route = routeMap[dir.name];
            if (!route) return null;

              const items = (dir.children ?? []).map((child) => ({
                ...child,
                slug: `${encodeURIComponent(child.name)}-${child.id}`,
              }));

              return (
                <SidebarGroup
                  key={dir.id}
                  parent={dir.id}
                  title={`${route.emoji} ${dir.name}`}
                  initialItems={items}
                  basePath={`/${route.slug}`}
                  currentPath={location.pathname}
                />
              );
            });

            return grouped;
          })()}
        </div>

      <div className="flex-shrink-0 w-full flex flex-col gap-4">
        <div className={`flex flex-row items-center ${
            isTrash ? "bg-primary text-white" : ""
          }`}>
          <IconTrash className={`${isTrash ? "text-white" : ""}`} />
          <SidebarItem label="휴지통" isActive={isTrash} to={"/trash"} />
        </div>
        <div className="flex flex-row items-center">
          <IconStore />
          <SidebarItem
            label="저장 용량"
            isActive={location.pathname === "/store"}
          />
        </div>
        <div className="text-xs font-pretendard text-font">
          <div className="h-2.5 w-full bg-[#d9d9d9] overflow-hidden">
            <div className="h-2.5 bg-[#61758f]" style={{ width: "55%" }}></div>
          </div>
          <div className="mt-1">
            <strong className="font-extrabold">2GB</strong> 중{" "}
            <strong className="font-extrabold">1.1GB</strong> 사용
          </div>
        </div>
      </div>
      </aside>
    </DndContext>
  );
}

export default Sidebar;
