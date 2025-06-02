import React from "react";
import IconDocs from "../../assets/icon/icon_docs.svg?react";
import IconNote from "../../assets/icon/icon_note.svg?react";
import IconFavorite from "../../assets/icon/icon_favorite.svg?react";
import IconDownload from "../../assets/icon/icon_download.svg?react";
import IconCheck from "../../assets/icon/icon_check.svg?react";
import Button from "../inputs/Button";

export interface Item {
  id: string;
  title: string;
  description: string;
  type: "doc" | "note" | "etc";
  categories: string[];
  isSelected: boolean;
  isFavorite: boolean;
}

const getIcon = (type: Item["type"]) => {
  switch (type) {
    case "doc":
      return <IconDocs />;
    case "note":
      return <IconNote />;
    default:
      return <IconDocs />;
  }
};

const GalleryItem: React.FC<{
  item: Item;
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  selectable: boolean;
}> = ({ item, onToggleSelect, onToggleFavorite, selectable }) => {
  return (
    <div
      className="px-4 py-4 bg-white border-t border-b border-font flex flex-col items-center font-pretendard space-y-6"
      style={{
        borderTop: "0.5px solid #4B5563",
        borderBottom: "0.5px solid #4B5563",
      }}
    >
      <div className="w-full relative flex items-center">
        <div className="ml-8 flex-1 text-black text-xl font-normal truncate whitespace-nowrap overflow-hidden">
          {item.title}
        </div>
        <div className="absolute left-0 top-[3px] w-6 h-6 flex items-center justify-center">
          {selectable ? (
            <div
              className="w-5 h-5 min-w-[20px] min-h-[20px] flex items-center bg-primary_light justify-center rounded-sm"
              style={{
                border: "0.5px solid #4B5563", // Tailwind gray-600 equivalent
              }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(item.id);
              }}
            >
              {item.isSelected && (
                <IconCheck className="w-3 h-3 text-blue-600" />
              )}
            </div>
          ) : (
            getIcon(item.type)
          )}
        </div>
        <div
          className="w-6 h-6 ml-auto cursor-pointer select-none"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
        >
          <IconFavorite
            className={item.isFavorite ? "text-danger" : "text-gray-300"}
          />
        </div>
      </div>

      <div className="w-full min-h-[95px] text-font text-base sm:text-lg font-normal whitespace-pre-line">
        {item.description}
      </div>

      <div className="w-full max-w-[200px] ml-auto flex justify-end items-center gap-4">
        <Button color="secondary" size="small" onClick={() => {}}>
          수정
        </Button>
        <Button color="primary" size="small" onClick={() => {}}>
          요약
        </Button>
        <div className="w-[30px] h-[30px] flex items-center justify-center">
          <IconDownload className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default GalleryItem;
