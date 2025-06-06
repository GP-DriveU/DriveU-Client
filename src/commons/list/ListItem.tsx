import React from "react";
import { type Item } from "../../types/Item";
import { getIcon } from "../../utils/itemUtils";
import IconFavorite from "../../assets/icon/icon_favorite.svg?react";
import IconDownload from "../../assets/icon/icon_download.svg?react";
import IconCheck from "../../assets/icon/icon_check.svg?react";
import Button from "../inputs/Button";

const ListItem: React.FC<{
  item: Item;
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  selectable: boolean;
  onClickItem: (id: string) => void;
}> = ({ item, onToggleSelect, onToggleFavorite, selectable, onClickItem }) => {
  return (
    <div
      className="flex items-center justify-between px-4 py-2 bg-white shadow-sm mb-2"
      style={{
        borderTop: "0.5px solid #4B5563",
        borderBottom: "0.5px solid #4B5563",
      }}
      onClick={() => onClickItem(item.id)}
    >
      <div className="flex items-center gap-2">
        <div className="cursor-pointer">
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
        <div className="w-48 font-medium flex flex-col">
          <div>{item.title}</div>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className="cursor-pointer ml-2 flex-shrink-0 z-10 p-1"
          style={{ userSelect: "none" }}
        >
          <IconFavorite
            className={item.isFavorite ? "text-danger" : "text-gray-300"}
          />
        </div>
        {item.categories.map((category, idx) => (
          <span
            key={idx}
            className="text-xs text-center outline outline-1 outline-offset-[-1px] outline-tag-yellow bg-tag-yellow/50 text-font px-3 py-0.5 rounded-[5px]"
            style={{ userSelect: "none" }}
          >
            {category}
          </span>
        ))}
      </div>
      <div className="flex gap-2 min-w-[200px]">
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

export default ListItem;
