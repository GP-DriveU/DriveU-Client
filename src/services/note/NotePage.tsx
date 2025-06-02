import { type Item } from "../../commons/gallery/GalleryItem";
import Gallery from "../../commons/gallery/GalleryList";
import { useState } from "react";

function NotePage() {
  const dummyItems: Item[] = [
    {
      id: "1",
      title: "객체지향프로그래밍 1주차",
      description: "오늘은 클래스와 객체를 배웠습니다.",
      type: "doc",
      categories: ["객지프"],
      isSelected: false,
      isFavorite: false,
    },
    {
      id: "2",
      title: "자료구조 정리노트",
      description: "스택, 큐, 트리 기본 개념 정리",
      type: "note",
      categories: ["자료구조"],
      isSelected: true,
      isFavorite: false,
    },
    {
      id: "3",
      title: "분산시스템 발표자료",
      description: "CAP 이론 및 사례 정리",
      type: "doc",
      categories: ["분산시"],
      isSelected: false,
      isFavorite: true,
    },
  ];

  const [items, setItems] = useState<Item[]>(dummyItems);

  const handleToggleSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  return (
    <div className="flex bg-white">
      <Gallery
        items={items}
        onToggleSelect={handleToggleSelect}
        onToggleFavorite={handleToggleFavorite}
        selectable={true}
      />
    </div>
  );
}

export default NotePage;
