import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createDirectory, deleteDirectory, updateDirectoriesOrder } from "@/api/Directory";
import { useSemesterStore } from "@/store/useSemesterStore";
import { useTagStore } from "@/store/useTagStore";
import {
  useDirectoryStore,
  type DirectoryItem,
} from "@/store/useDirectoryStore";
import DirectoryAddModal from "@/commons/modals/DirectoryAddModal";
import SortableItem from "./SortableItem";
import { IconAdd } from "@/assets";

type ItemType = DirectoryItem & { slug: string };

interface SidebarGroupProps {
  parent: number;
  title: string;
  initialItems: ItemType[];
  basePath: string;
  currentPath: string;
}

function SidebarGroup({
  parent,
  title,
  initialItems,
  basePath,
  currentPath,
}: SidebarGroupProps) {
  const [items, setItems] = useState<ItemType[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDirName, setNewDirName] = useState("");
  const currentSemesterId =
    useSemesterStore().getCurrentSemester()?.userSemesterId;

  const { setSemesterDirectories } = useDirectoryStore.getState();
  const currentSemester = useSemesterStore.getState();
  const updateDirectoryOrder = useDirectoryStore(
    (state) => state.updateDirectoryOrder
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.slug === active.id);
      const newIndex = items.findIndex((item) => item.slug === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);

      setItems(newItems);

      const newChildrenForStore = newItems.map(({ slug, ...rest }, index) => ({
        ...rest,
        order: index,
      }));
      
      updateDirectoryOrder(parent, newChildrenForStore);

      try {
        if (!currentSemesterId) throw new Error("학기 정보가 없습니다.");

        const updates = newChildrenForStore.map((item) => ({
          directoryId: item.id,
          order: item.order,
        }));

        await updateDirectoriesOrder({
          parentDirectoryId: parent,
          updates,
        });
      } catch (error) {
        console.error("순서 변경 API 호출 실패:", error);
        // [TODO] 에러 처리 (예: 토스트 알림, 상태 롤백)
        // 지금은 낙관적 업데이트를 롤백하지 않지만, 필요시 롤백 로직 추가
      }
    }
  }

  const handleDelete = async (directoryId: number) => {
    try {
      if (!currentSemesterId) throw new Error("학기 정보가 없습니다.");

      await deleteDirectory(directoryId);

      setItems((prev) => prev.filter((item) => item.id !== directoryId));

      const year = currentSemester.getCurrentSemester()?.year;
      const term = currentSemester.getCurrentSemester()?.term;

      if (year && term) {
        setSemesterDirectories(year, term, (prev) =>
          prev.map((dir) => {
            if (dir.id === parent) {
              return {
                ...dir,
                children: (dir.children ?? []).filter(
                  (child) => child.id !== directoryId
                ),
              };
            }
            return dir;
          })
        );
      }

      const { tags, setTags } = useTagStore.getState();
      setTags(tags.filter((tag) => tag.id !== directoryId));
    } catch (error) {
      console.error("디렉토리 삭제 API 호출 실패:", error);
      // [TODO] 에러 처리 (예: 토스트 알림)
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between py-1">
          <span className="text-xl font-semibold">{title}</span>
          <IconAdd onClick={() => setIsModalOpen(true)} />
        </div>
        <hr className="border-font border-t-0.5" />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.slug)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => {
              const path = `${basePath}/${item.slug}`;
              return (
                <SortableItem
                  key={item.slug}
                  id={item.slug}
                  directoryId={item.id}
                  label={item.name}
                  to={path}
                  isActive={currentPath.startsWith(path)}
                  onDelete={handleDelete}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
      <DirectoryAddModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewDirName("");
        }}
        onSubmit={async (name) => {
          const isDuplicate = items.some((item) => item.name === name.trim());
          if (isDuplicate) {
            alert("이미 존재하는 디렉토리 이름입니다.");
            return;
          }
          try {
            const userSemesterId = currentSemesterId ?? 0;
            const parentDirectoryId = parent;
            const newDir = await createDirectory(userSemesterId, {
              parentDirectoryId,
              name,
            });

            const newSlug = `${encodeURIComponent(name)}-${newDir.id}`;

            const newDirectoryItem: DirectoryItem = {
              id: newDir.id,
              name: newDir.name,
              order: newDir.order,
              is_default: false,
              children: [],
            };

            setItems([...items, { ...newDirectoryItem, slug: newSlug }]);

            const year = currentSemester.getCurrentSemester()?.year;
            const term = currentSemester.getCurrentSemester()?.term;

            if (year && term) {
              setSemesterDirectories(year, term, (prev) =>
                prev.map((dir) => {
                  if (dir.id === parentDirectoryId) {
                    return {
                      ...dir,
                      children: [...(dir.children ?? []), newDirectoryItem],
                    };
                  }
                  return dir;
                })
              );
            }

            const { tags, setTags } = useTagStore.getState();
            const updatedTags = [
              ...tags,
              {
                id: newDir.id,
                title: name,
                color: "tag-yellow",
                parentDirectoryId: parentDirectoryId,
              },
            ];
            setTags(updatedTags);
          } catch (e) {
            console.error(e);
          } finally {
            setIsModalOpen(false);
            setNewDirName("");
          }
        }}
        newDirName={newDirName}
        setNewDirName={setNewDirName}
        items={items.map((item) => ({ name: item.name, slug: item.slug }))}
      />
    </>
  );
}

export default SidebarGroup;
