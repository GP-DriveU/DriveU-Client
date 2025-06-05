import React, { useState } from "react";
import Button from "../../commons/inputs/Button";
import IconDeletion from "../../assets/icon/icon_delete.svg?react";
import IconEdit from "../../assets/icon/icon_edit_mypage.svg?react";

interface EditSemesterProps {
  semesters: string[];
  onRequestDelete: (semester: string) => void;
  setSemesters: React.Dispatch<React.SetStateAction<string[]>>;
  onEditComplete?: () => void;
  onCreateSemester?: (data: {
    year: number;
    term: "SPRING" | "SUMMER" | "FALL" | "WINTER";
  }) => Promise<{
    year: number;
    term: "SPRING" | "SUMMER" | "FALL" | "WINTER";
  }>;
  onUpdateSemester?: (
    index: number,
    data: { year: number; term: "SPRING" | "SUMMER" | "FALL" | "WINTER" }
  ) => void;
}

const EditSemester: React.FC<EditSemesterProps> = ({
  semesters,
  onRequestDelete,
  setSemesters,
  onEditComplete,
  onCreateSemester,
  onUpdateSemester,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedSemester, setEditedSemester] = useState("");
  const [newSemesterInput, setNewSemesterInput] = useState("");

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedSemester(semesters[index]);
  };

  const handleChangeSemester = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSemester(e.target.value);
  };

  const handleConfirmEdit = (index: number) => {
    if (editedSemester.trim() === "") {
      setEditingIndex(null);
      return;
    }

    // Format validation: 2025년 1학기 or 2025년 2학기
    const formatRegex = /^\d{4}년 [12]학기$/;
    if (!formatRegex.test(editedSemester.trim())) {
      alert("형식은 예: 2025년 1학기 처럼 입력해주세요.");
      return;
    }

    // Duplicate check (ignore self)
    if (
      semesters.some(
        (s, i) => i !== index && s.trim() === editedSemester.trim()
      )
    ) {
      alert("중복된 학기입니다.");
      return;
    }

    const matches = editedSemester.match(/\d+/g) || [];
    const year = matches[0] ? parseInt(matches[0], 10) : NaN;
    const term = matches[1] === "1" ? "SPRING" : "FALL";
    const displayString = `${year}년 ${term === "SPRING" ? "1학기" : "2학기"}`;

    setSemesters((prev) => {
      const updated = [...prev];
      updated[index] = displayString;
      return updated;
    });

    if (!isNaN(year)) {
      if (semesters[index].trim() === "") {
        onCreateSemester?.({ year, term });
      } else {
        onUpdateSemester?.(index, { year, term });
      }
    }

    setEditingIndex(null);
  };

  const handleSaveAll = () => {
    console.log("Saved semesters:", semesters);
    if (onEditComplete) onEditComplete();
  };

  const handleNewSemesterSubmit = async () => {
    const trimmed = newSemesterInput.trim();
    const formatRegex = /^\d{4}년 [12]학기$/;
    if (!formatRegex.test(trimmed)) {
      alert("형식은 예: 2025년 1학기 처럼 입력해주세요.");
      return;
    }

    if (semesters.includes(trimmed)) {
      alert("중복된 학기입니다.");
      return;
    }

    const [yearStr, termStr] = trimmed.split("년 ");
    const year = parseInt(yearStr, 10);
    const term = termStr === "1학기" ? "SPRING" : "FALL";

    const created = await onCreateSemester?.({ year, term });
    if (created) {
      const display = `${created.year}년 ${
        created.term === "SPRING" ? "1학기" : "2학기"
      }`;
      setSemesters((prev) => [...prev, display]);
      setNewSemesterInput("");
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-xl outline outline-1 outline-gray-300 flex flex-col items-center gap-4">
      {semesters.map((semester, index) => (
        <div
          key={index}
          className="w-full flex justify-between items-center px-2 py-2"
        >
          {editingIndex === index || semester.trim() === "" ? (
            <input
              className="min-w-[110px] px-3 py-1 bg-white border border-gray-500 border-solid rounded-lg text-base text-gray-800"
              value={editedSemester}
              placeholder="예: 2025년 1학기"
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

      <div className="w-full flex items-center gap-44 pl-6">
        <input
          className="flex-1 px-3 py-2 border border-dashed border-blue-400 bg-blue-50 rounded-lg text-base text-gray-800"
          placeholder="예: 2025년 1학기"
          value={newSemesterInput}
          onChange={(e) => setNewSemesterInput(e.target.value)}
        />
        <Button
          size="medium"
          color="primary"
          onClick={() => handleNewSemesterSubmit()}
        >
          항목 추가
        </Button>
      </div>

      <div className="w-32 ml-auto flex justify-end">
        <Button size="medium" color="secondary" onClick={handleSaveAll}>
          수정 완료
        </Button>
      </div>
    </div>
  );
};

export default EditSemester;
