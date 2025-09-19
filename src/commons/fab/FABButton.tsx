import { IconFAB } from "@/assets/index";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FABButton: React.FC<{
  isGenerating: boolean;
  isSelecting: boolean;
  onStartGenerating: () => void;
  onCancelGenerating: () => void;
  onSubmitGenerating: () => void;
  onCancelSelecting: () => void;
  onStartSelecting: () => void;
  onUploadClick: () => void;
  onStartDelete: () => void;
  onWriteNoteClick?: () => void;
}> = ({
  isGenerating,
  isSelecting,
  onStartGenerating,
  onCancelGenerating,
  onSubmitGenerating,
  onCancelSelecting,
  onStartSelecting,
  onUploadClick,
  onStartDelete,
  onWriteNoteClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams();
  const showWriteNote = slug?.startsWith("강의필기");
  const actions = (
    isGenerating
      ? [{ label: "문제 생성" }, { label: "문제 생성 취소" }]
      : isSelecting && !isGenerating
      ? [{ label: "선택 항목 삭제" }, { label: "삭제 취소" }]
      : [
          !showWriteNote ? { label: "업로드" } : null,
          showWriteNote ? { label: "노트 작성" } : null,
          { label: "삭제" },
          { label: "문제 생성" },
          { label: "문제 확인" },
        ]
  ).filter(Boolean);

  return (
    <div className="flex flex-col items-center gap-2 w-fit font-pretendard">
      {actions.map((action, index) => {
        if (!action) return null;
        return (
          <div
            key={action.label}
            className={`flex items-center gap-2 transition-all duration-300 ${
              isOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div
              className="px-3 py-1 w-20 bg-secondary font-bold text-center text-white text-sm rounded-md shadow cursor-pointer"
              onClick={() => {
                if (action.label === "문제 생성") {
                  if (!isGenerating) {
                    onStartGenerating();
                  } else {
                    onSubmitGenerating();
                  }
                  setIsOpen(false);
                } else if (action.label === "업로드") {
                  onUploadClick();
                  setIsOpen(false);
                } else if (action.label === "삭제") {
                  if (!isSelecting) {
                    onStartSelecting();
                  }
                  setIsOpen(false);
                } else if (action.label === "선택 항목 삭제") {
                  onStartDelete();
                  onCancelSelecting();
                  setIsOpen(false);
                } else if (action.label === "삭제 취소") {
                  onCancelSelecting();
                  setIsOpen(false);
                } else if (action.label === "문제 생성 취소") {
                  onCancelGenerating();
                  setIsOpen(false);
                } else if (action.label === "선택 취소") {
                  onCancelSelecting();
                  setIsOpen(false);
                } else if (action.label === "문제 확인") {
                  navigate("/question");
                } else if (action.label === "노트 작성") {
                  onWriteNoteClick?.();
                  setIsOpen(false);
                }
              }}
            >
              {action.label}
            </div>
          </div>
        );
      })}
      <div
        className={`w-20 h-20 rounded-2xl flex items-center text-center justify-center mt-2 cursor-pointer animate-bounce-slow shadow ${
          isGenerating
            ? "bg-primary text-white"
            : "bg-primary_light text-primary"
        }`}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {isGenerating ? (
          <span className="text-sm font-bold">
            선택 완료
            <br />
          </span>
        ) : isSelecting ? (
          <span className="text-sm font-bold">선택 완료</span>
        ) : (
          <IconFAB />
        )}
      </div>
    </div>
  );
};

export default FABButton;
