import { useEffect, useState } from "react";
import List from "../../commons/list/List";
import { type Item } from "../../commons/list/ListItem";
import HomeSection from "./HomeSection";
import { useNavigate } from "react-router-dom";
import { getMainPage } from "../../api/Home";
import type { MainPageResponse } from "../../api/Home";

function HomePage() {
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchMainPage = async () => {
      try {
        const userSemesterId = 1; // replace with real value from store later
        const data: MainPageResponse = await getMainPage(userSemesterId);

        const convert = (files: MainPageResponse["recentFiles"]) =>
          files.map((file) => ({
            id: file.id.toString(),
            title: file.title,
            description: file.previewLine,
            type: (["file", "note", "resources"].includes(
              file.extension.toLowerCase()
            )
              ? file.extension.toLowerCase()
              : "file") as "file" | "note" | "resources",
            categories: [file.tag?.tagName ?? ""],
            isFavorite: file.favorite,
            isSelected: false,
          }));

        setRecentItems(convert(data.recentFiles));
        setFavoriteItems(convert(data.favoriteFiles));
      } catch (e) {
        console.error("메인페이지 데이터를 불러오지 못했습니다:", e);
      }
    };

    fetchMainPage();
  }, []);

  const handleToggleSelect = (id: string) => {
    setRecentItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
    setFavoriteItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const handleToggleFavorite = (id: string) => {
    setRecentItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
    setFavoriteItems((prev) =>
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
          items={recentItems}
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
          items={favoriteItems}
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
