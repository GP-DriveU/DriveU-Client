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
import { createDirectory } from "@/api/Directory";
import { useSemesterStore } from "@/store/useSemesterStore";
import { useTagStore } from "@/store/useTagStore";
import { useDirectoryStore } from "@/store/useDirectoryStore";
import DirectoryAddModal from "@/commons/modals/DirectoryAddModal";
import SortableItem from "./SortableItem";
import { IconAdd } from "@/assets";

interface SidebarGroupProps {
  parent: number;
  title: string;
  initialItems: { name: string; slug: string }[];
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
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDirName, setNewDirName] = useState("");
  const currentSemesterId =
    useSemesterStore().getCurrentSemester()?.userSemesterId;
  const { setSemesterDirectories } = useDirectoryStore.getState();
  const currentSemester = useSemesterStore.getState();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.slug === active.id);
        const newIndex = items.findIndex((item) => item.slug === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

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
            {items.map(({ name, slug }) => {
              const path = `${basePath}/${slug}`;
              return (
                <SortableItem
                  key={slug}
                  id={slug}
                  label={name}
                  to={path}
                  isActive={currentPath.startsWith(path)}
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
            setItems([...items, { name, slug: newSlug }]);
            const year = currentSemester.getCurrentSemester()?.year;
            const term = currentSemester.getCurrentSemester()?.term;

            if (year && term) {
              setSemesterDirectories(year, term, (prev) =>
                prev.map((dir) => {
                  if (dir.id === parentDirectoryId) {
                    return {
                      ...dir,
                      children: [
                        ...(dir.children ?? []),
                        {
                          id: newDir.id,
                          name: newDir.name,
                          order: newDir.order,
                          is_default: false,
                          children: [],
                        },
                      ],
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
        items={items}
      />
    </>
  );
}

export default SidebarGroup;
