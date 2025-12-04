import { useState, useEffect, useRef } from "react";
import { IconMenu, IconQuestion } from "@/assets";

export interface GalleryQuestionItemProps {
  id: string;
  version: string;
  title: string;
  date: string;
  onClick?: () => void;
  onRename?: (id: string, newTitle: string) => void;
}

function GalleryQuestionItem({
  id,
  version,
  title,
  date,
  onClick,
  onRename,
}: GalleryQuestionItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setEditTitle(title);
  }, [title]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editTitle.trim() !== "" && editTitle !== title && onRename) {
      onRename(id, editTitle);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditTitle(title);
    }
  };

  return (
    <div
      className="w-full p-4 bg-[#FFFFFF] text-pretendard rounded-lg flex flex-col justify-between gap-y-4 cursor-pointer relative shadow-sm hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1 flex-1 min-w-0 mr-2">
          <div className="flex items-center gap-2">
            <IconQuestion />
            <span className="text-xs text-font font-normal">ver.{version}</span>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={handleInputClick}
              onBlur={() => handleSubmit()}
              autoFocus
              className="text-lg font-semibold border border-primary outline-none bg-transparent w-full"
            />
          ) : (
            <h2 className="text-lg text-black font-semibold truncate">
              {title}
            </h2>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <div
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            onClick={handleMenuClick}
          >
            <IconMenu />
          </div>

          {isMenuOpen && (
            <div className="absolute right-0 top-6 w-32 bg-white rounded-md shadow-lg border border-gray-100 z-10 py-1">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={handleEditClick}
              >
                제목 수정
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-pretendard">{date}</span>
      </div>
    </div>
  );
}

export default GalleryQuestionItem;
