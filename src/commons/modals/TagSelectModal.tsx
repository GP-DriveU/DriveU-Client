import { useState } from "react";
import Button from "@/commons/inputs/Button";
import { type TagData } from "@/types/tag";

interface TagSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedTags: TagData[]) => void;
  availableTags: TagData[];
  initialTags?: TagData[];
}
function TagSelectModal ({
  isOpen,
  onClose,
  onSave,
  availableTags,
  initialTags,
}: TagSelectModalProps) {

  const [selectedTags, setSelectedTags] = useState<TagData[]>(
    initialTags ?? []
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center font-pretendard">
      <div className="bg-white p-6 rounded-md w-[500px]">
        <div className="text-lg font-semibold mb-4">태그 선택</div>
        <div className="flex flex-wrap gap-2">
          {availableTags.length === 0 ? (
            <p className="text-sm text-font">선택 가능한 태그가 없습니다.</p>
          ) : (
            availableTags.map((tag) => {
              const isSelected = selectedTags.some(
                (t) => t.title === tag.title
              );
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
            })
          )}
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
