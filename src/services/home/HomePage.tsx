import { useState } from "react";
import List from "../../commons/list/List";
import { type Item } from "../../commons/list/ListItem";
import HomeSection from "./HomeSection";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

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

  const handleItemClick = (id: string) => {
    navigate(`/study/강의필기/${id}`);
  };

  return (
    <div className="w-full flex flex-col">
      <HomeSection />
      <div className="flex-1 px-6">
        <div className="px-4 justify-center text-black text-xl font-semibold font-pretendard">
          최근 업로드한 파일
        </div>
        <List
          items={items}
          onToggleSelect={handleToggleSelect}
          onToggleFavorite={handleToggleFavorite}
          selectable={false}
          onClickItem={handleItemClick}
        />
      </div>
      <div className="flex-1 px-6">
        <div className="px-4 justify-center text-black text-xl font-semibold font-pretendard">
          즐겨찾기한 파일
        </div>
        <List
          items={items}
          onToggleSelect={handleToggleSelect}
          onToggleFavorite={handleToggleFavorite}
          selectable={false}
          onClickItem={handleItemClick}
        />
      </div>
    </div>
  );
}

export default HomePage;
