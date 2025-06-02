import { useEffect, useState } from "react";
import { useDirectoryStore } from "../../store/useDirectoryStore";
import List from "../../commons/list/List";
import { type Item } from "../../commons/list/ListItem";
import HomeSection from "./HomeSection";

function HomePage() {
  const { setSemesterDirectories, setSelectedSemester } = useDirectoryStore();

  useEffect(() => {
    const dummyData = [
      {
        id: 100,
        name: "학업",
        is_default: true,
        order: 1,
        children: [
          {
            id: 101,
            name: "강의필기",
            is_default: true,
            order: 1,
            children: [],
          },
          { id: 102, name: "과제", is_default: true, order: 2, children: [] },
          {
            id: 103,
            name: "프로젝트",
            is_default: true,
            order: 2,
            children: [],
          },
        ],
      },
      {
        id: 200,
        name: "수업",
        is_default: true,
        order: 2,
        children: [
          {
            id: 201,
            name: "객지론",
            is_default: false,
            order: 1,
            children: [],
          },
          {
            id: 202,
            name: "자료구조",
            is_default: false,
            order: 1,
            children: [],
          },
          {
            id: 203,
            name: "분산시",
            is_default: false,
            order: 1,
            children: [],
          },
        ],
      },
      {
        id: 300,
        name: "대외활동",
        is_default: true,
        order: 3,
        children: [
          { id: 301, name: "동아리", is_default: true, order: 1, children: [] },
          {
            id: 302,
            name: "공모전",
            is_default: true,
            order: 2,
            children: [
              {
                id: 310,
                name: "머시기 공모전",
                is_default: false,
                order: 1,
                children: [],
              },
            ],
          },
        ],
      },
    ];

    setSemesterDirectories("2024-1", dummyData);
    setSelectedSemester("2024-1");
  }, []);

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
    <div className="w-full flex flex-col">
      <HomeSection />
      <div className="flex-1 px-6">
        <div className="px-4 justify-center text-black text-xl font-semibold font-pretendard">
          즐겨찾기한 파일
        </div>
        <List
          items={items}
          onToggleSelect={handleToggleSelect}
          onToggleFavorite={handleToggleFavorite}
          selectable={true}
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
          selectable={true}
        />
      </div>
    </div>
  );
}

export default HomePage;
