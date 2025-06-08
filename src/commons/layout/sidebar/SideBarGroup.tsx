import React, { useState } from "react";
import SidebarItem from "./SideBarItem";
import IconAdd from "../../../assets/icon/icon_adddir.svg?react";
import { createDirectory } from "../../../api/Directory";
import { useSemesterStore } from "../../../store/useSemesterStore";
import DirectoryAddModal from "../../modals/DirectoryAddModal";

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
            await createDirectory(userSemesterId, {
              parentDirectoryId,
              name,
            });
            const newSlug = `${encodeURIComponent(name)}-temp`;
            setItems([...items, { name, slug: newSlug }]);
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
