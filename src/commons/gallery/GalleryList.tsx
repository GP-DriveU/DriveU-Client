import React from "react";
import GalleryItem, { type Item } from "./GalleryItem";

interface GalleryProps {
  items: Item[];
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  selectable: boolean;
}

const Gallery: React.FC<GalleryProps> = ({
  items,
  onToggleSelect,
  onToggleFavorite,
  selectable,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {items.map((item) => (
        <GalleryItem
          key={item.id}
          item={item}
          onToggleSelect={onToggleSelect}
          onToggleFavorite={onToggleFavorite}
          selectable={selectable}
        />
      ))}
    </div>
  );
};

export default Gallery;
