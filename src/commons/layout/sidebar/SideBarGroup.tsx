import { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  createDirectory,
  deleteDirectory,
  updateDirectoryName,
} from "@/api/Directory";
import { useSemesterStore } from "@/store/useSemesterStore";
import { useTagStore } from "@/store/useTagStore";
import { useDirectoryStore } from "@/store/useDirectoryStore";
import DirectoryAddModal from "@/commons/modals/DirectoryAddModal";
import SortableItem from "./SortableItem";
import { IconAdd } from "@/assets";
import { useDroppable } from "@dnd-kit/core";
import type { DirectoryItem } from "@/types/directory";

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
  initialItems: items,
  basePath,
  currentPath,
}: SidebarGroupProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDirName, setNewDirName] = useState("");
  const currentSemesterId =
    useSemesterStore().getCurrentSemester()?.userSemesterId;

  const { setSemesterDirectories, updateDirectoryName: updateStoreDirName } =
    useDirectoryStore.getState();
  const currentSemester = useSemesterStore.getState();

  const { isOver, setNodeRef } = useDroppable({
    id: `group-${parent}`,
  });

  const handleDelete = async (directoryId: number) => {
    try {
      if (!currentSemesterId) throw new Error("학기 정보가 없습니다.");

      await deleteDirectory(directoryId);

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
    }
  };

  const handleRename = async (directoryId: number, newName: string) => {
    const previousName = items.find((item) => item.id === directoryId)?.name;
    updateStoreDirName(parent, directoryId, newName);

    try {
      await updateDirectoryName(directoryId, { name: newName });

      const { tags, setTags } = useTagStore.getState();
      setTags(
        tags.map((tag) =>
          tag.id === directoryId ? { ...tag, title: newName } : tag
        )
      );
    } catch (error) {
      if (previousName) {
        updateStoreDirName(parent, directoryId, previousName);
      }
      console.error("이름 변경 API 호출 실패:", error);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between py-1">
          <span className="text-xl font-semibold">{title}</span>
          <IconAdd
            className="cursor-pointer w-5 h-5"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        <hr className="border-font border-t-0.5" />
        <div
          ref={setNodeRef}
          className={`transition-colors rounded-md ${
            isOver ? "bg-primary-dark" : ""
          } ${items.length === 0 ? "min-h-[32px]" : ""}`}
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
                  onRename={handleRename}
                />
              );
            })}
          </SortableContext>
        </div>
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

            const newDirectoryItem: DirectoryItem = {
              id: newDir.id,
              name: newDir.name,
              order: newDir.order,
              is_default: false,
              children: [],
            };

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
