import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SidebarItem from "./SideBarItem";
import AlertModal from "@/commons/modals/AlertModal";
import { IconDrag, IconTrash } from "@/assets";
import { useState, type MouseEvent } from "react";

interface SortableItemProps {
  id: string;
  directoryId: number;
  label: string;
  to: string;
  isActive: boolean;
  onDelete: (directoryId: number) => void;
}

function SortableItem(props: SortableItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    props.onDelete(props.directoryId);
    setIsModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="group relative flex items-center w-full"
      >
        <button
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab p-1"
          aria-label="항목 드래그"
        >
          <IconDrag className="w-4 h-4 text-gray-400" />
        </button>

        <div className="flex-grow">
          <SidebarItem
            label={props.label}
            to={props.to}
            isActive={props.isActive}
          />
        </div>

        <button
          onClick={handleDeleteClick}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
          aria-label={`${props.label} 삭제`}
        >
          <IconTrash className="w-4 h-4 text-gray-500 hover:text-red-500" />
        </button>
      </div>

      {isModalOpen && (
        <AlertModal
          title={`'${props.label}'을(를) 삭제하시겠습니까?`}
          description="디렉토리를 삭제하면<br/>해당 디렉토리의 모든 파일 및 내용이 휴지통으로 이동합니다."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDanger
        />
      )}
    </>
  );
}

export default SortableItem;
