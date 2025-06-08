import React from "react";
import GalleryItem from "./GalleryItem";
import { type Item } from "../../types/Item";

interface GalleryProps {
  items: Item[];
  onToggleSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  selectable: boolean;
  onClickItem: (id: number) => void;
}

const Gallery: React.FC<GalleryProps> = ({
  items,
  onToggleSelect,
  onToggleFavorite,
  selectable,
  onClickItem,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 px-4 py-6 w-full">
      {items && items.length > 0 ? (
        items.map((item) => (
          <GalleryItem
            key={item.id}
            item={item}
            onToggleSelect={onToggleSelect}
            onToggleFavorite={onToggleFavorite}
            selectable={selectable}
            onClickItem={onClickItem}
          />
        ))
      ) : (
        <div className="col-span-full w-full flex justify-center items-center py-3">
          <p className="text-gray-500 text-base">
            현재 저장된 파일이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
