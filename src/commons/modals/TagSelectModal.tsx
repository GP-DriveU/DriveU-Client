import React, { useState, useEffect } from "react";
import { useDirectoryStore } from "../../store/useDirectoryStore";
import Button from "../inputs/Button";

interface TagData {
  id: number;
  title: string;
  color: string;
}

interface TagSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedTags: TagData[]) => void;
  initialTags?: TagData[];
}

const TagSelectModal: React.FC<TagSelectModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [availableTags, setAvailableTags] = useState<TagData[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagData[]>([]);
  const userDirectories = useDirectoryStore((state) =>
    state.getCurrentDirectories()
  );
  useEffect(() => {
    if (isOpen) {
      const tags = userDirectories
        .flatMap((dir) => dir.children ?? [])
        .map((child) => ({
          id: child.id,
          title: child.name,
          color: "#A1A1AA", // default color
        }));
      setAvailableTags(tags);
      setSelectedTags([]);
    }
  }, [isOpen, userDirectories]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center font-pretendard">
      <div className="bg-white p-6 rounded-md w-[500px]">
        <div className="text-lg font-semibold mb-4">태그 선택</div>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.some((t) => t.title === tag.title);
            return (
              <button
                key={tag.title}
                onClick={() => {
                  setSelectedTags(isSelected ? [] : [tag]);
                }}
                className={`px-3 py-1 rounded-full border ${
                  isSelected
                    ? "bg-secondary text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {tag.title}
              </button>
            );
          })}
        </div>
        <div className="flex w-48 ml-auto justify-end gap-2 mt-4">
          <Button size="medium" color="primary" onClick={onClose}>
            취소
          </Button>
          <Button
            size="medium"
            color="secondary"
            onClick={() => onSave(selectedTags)}
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TagSelectModal;
