import React from "react";
import GalleryItem from "./GalleryItem";
import { type Item } from "../../types/Item";

interface GalleryProps {
  items: Item[];
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  selectable: boolean;
  onClickItem: (id: string) => void;
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
      {items.map((item) => (
        <GalleryItem
          key={item.id}
          item={item}
          onToggleSelect={onToggleSelect}
          onToggleFavorite={onToggleFavorite}
          selectable={selectable}
          onClickItem={onClickItem}
        />
      ))}
    </div>
  );
};

export default Gallery;
