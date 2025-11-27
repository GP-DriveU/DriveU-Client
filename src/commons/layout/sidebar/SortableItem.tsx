import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SidebarItem from "./SideBarItem";
import AlertModal from "@/commons/modals/AlertModal";
import { IconDrag, IconTrash } from "@/assets";
import {
  useState,
  type MouseEvent,
  type KeyboardEvent,
} from "react";

interface SortableItemProps {
  id: string;
  directoryId: number;
  label: string;
  to: string;
  isActive: boolean;
  onDelete: (directoryId: number) => void;
  onRename: (directoryId: number, newName: string) => void;
}

function SortableItem(props: SortableItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(props.label);

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

  const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSubmitRename = () => {
    setIsEditing(false);
    const newName = inputValue.trim();

    if (newName && newName !== props.label) {
      props.onRename(props.directoryId, newName);
    } else {
      setInputValue(props.label);
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmitRename();
    } else if (e.key === "Escape") {
      setInputValue(props.label);
      setIsEditing(false);
    }
  };

  const handleInputBlur = () => {
    handleSubmitRename();
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

        <div className="flex-grow" onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              autoFocus
              className="w-full h-8 px-4 text-xl font-normal font-pretendard bg-white border border-primary text-font"
            />
          ) : (
            <SidebarItem
              label={props.label}
              to={props.to}
              isActive={props.isActive}
            />
          )}
        </div>

        {!isEditing && (
          <button
            onClick={handleDeleteClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
            aria-label={`${props.label} 삭제`}
          >
            <IconTrash className="w-4 h-4 text-gray-500 hover:text-red-500" />
          </button>
        )}
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
