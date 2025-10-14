import GalleryItem from "@/commons/gallery/GalleryItem";
import { type Item } from "@/types/Item";
import EmptySection from "@/commons/section/EmptySection";

interface GalleryProps {
  items: Item[];
  onToggleSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  selectable: boolean;
  onClickItem: (id: number) => void;
}

function Gallery({  
  items,
  onToggleSelect,
  onToggleFavorite,
  selectable,
  onClickItem, }
  : GalleryProps) {

  return (
    <>
      {items && items.length > 0 ? (
        items.map((item) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 px-4 py-6 w-full">
            <GalleryItem
              key={item.id}
              item={item}
              onToggleSelect={onToggleSelect}
              onToggleFavorite={onToggleFavorite}
              selectable={selectable}
              onClickItem={onClickItem}
            />
          </div>
        ))
      ) : (
        <div className="w-full h-full flex flex-col py-6 items-center justify-center">
          <EmptySection
            title="저장된 파일 및 노트 없음"
            subtitle="새로운 파일이나 노트를 업로드하세요."
          />
        </div>
      )}
    </>
  );
};

export default Gallery;
