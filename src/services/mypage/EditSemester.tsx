import React, { useState } from "react";
import Button from "../../commons/inputs/Button";
import IconDeletion from "../../assets/icon/icon_delete.svg?react";
import IconEdit from "../../assets/icon/icon_edit_mypage.svg?react";

interface EditSemesterProps {
  semesters: string[];
  onRequestDelete: (semester: string) => void;
  setSemesters: React.Dispatch<React.SetStateAction<string[]>>;
  onEditComplete?: () => void;
}

const EditSemester: React.FC<EditSemesterProps> = ({
  semesters,
  onRequestDelete,
  setSemesters,
  onEditComplete,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedSemester, setEditedSemester] = useState("");

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedSemester(semesters[index]);
  };

  const handleChangeSemester = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSemester(e.target.value);
  };

  const handleConfirmEdit = (index: number) => {
    setSemesters((prev) => {
      const updated = [...prev];
      updated[index] = editedSemester;
      return updated;
    });
    setEditingIndex(null);
  };

  const handleAddSemester = () => {
    setSemesters((prev) => [...prev, "새 학기"]);
  };

  const handleSaveAll = () => {
    console.log("Saved semesters:", semesters);
    if (onEditComplete) onEditComplete();
  };

  return (
    <div className="w-full p-4 bg-white rounded-xl outline outline-1 outline-gray-300 flex flex-col items-center gap-4">
      {semesters.map((semester, index) => (
        <div
          key={index}
          className="w-full flex justify-between items-center px-2 py-2"
        >
          {editingIndex === index ? (
            <input
              className="min-w-[110px] px-3 py-1 bg-white border border-gray-500 border-solid rounded-lg text-base text-gray-800"
              value={editedSemester}
              onChange={handleChangeSemester}
              onBlur={() => handleConfirmEdit(index)}
              autoFocus
            />
          ) : (
            <div className="min-w-[200px] px-4 py-2 bg-neutral-50 rounded-lg border border-gray-300 text-base text-gray-600">
              {semester}
            </div>
          )}
          <div className="flex gap-4 items-center">
            <IconEdit onClick={() => handleEdit(index)} />
            <IconDeletion onClick={() => onRequestDelete(semester)} />
          </div>
        </div>
      ))}

      <div className="w-64 ml-auto flex justify-end gap-3 mt-4">
        <Button size="medium" color="primary" onClick={handleAddSemester}>
          항목 추가
        </Button>
        <Button size="medium" color="secondary" onClick={handleSaveAll}>
          수정 완료
        </Button>
      </div>
    </div>
  );
};

export default EditSemester;
