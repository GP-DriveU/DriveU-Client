import React, { useState } from "react";
import { createDirectory } from "@/api/Directory";
import { useSemesterStore } from "@/store/useSemesterStore";
import { useTagStore } from "@/store/useTagStore";
import { useDirectoryStore } from "@/store/useDirectoryStore";
import DirectoryAddModal from "@/commons/modals/DirectoryAddModal";
import SidebarItem from "@/commons/layout/sidebar/SideBarItem";
import { IconAdd } from "@/assets";

interface SidebarGroupProps {
  parent: number;
  title: string;
  initialItems: { name: string; slug: string }[];
  basePath: string;
  currentPath: string;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({
  parent,
  title,
  initialItems,
  basePath,
  currentPath,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDirName, setNewDirName] = useState("");
  const currentSemesterId =
    useSemesterStore().getCurrentSemester()?.userSemesterId;
  const { setSemesterDirectories } = useDirectoryStore.getState();
  const currentSemester = useSemesterStore.getState();

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between py-1">
          <span className="text-xl font-semibold">{title}</span>
          <IconAdd onClick={() => setIsModalOpen(true)} />
        </div>
        <hr className="border-font border-t-0.5" />
        {items.map(({ name, slug }) => {
          const path = `${basePath}/${slug}`;
          return (
            <SidebarItem
              key={slug}
              label={name}
              to={path}
              isActive={currentPath.startsWith(path)}
            />
          );
        })}
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
};

export default SidebarGroup;
