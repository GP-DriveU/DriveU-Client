import { useEffect, useState } from "react";
import List from "../../commons/list/List";
import type { Item } from "../../types/Item";
import HomeSection from "./HomeSection";
import { useNavigate } from "react-router-dom";
import { getMainPage } from "../../api/Home";
import type { MainPageResponse } from "../../api/Home";
import { useDirectoryStore } from "../../store/useDirectoryStore";
import { useSemesterStore } from "../../store/useSemesterStore";
import { toggleFavoriteResource } from "../../api/File";

function HomePage() {
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<Item[]>([]);
  const { getCurrentSemester } = useSemesterStore();

  useEffect(() => {
    const fetchMainPage = async () => {
      try {
        const userSemesterId = getCurrentSemester()?.userSemesterId;
        if (userSemesterId === undefined) return;
        const data: MainPageResponse = await getMainPage(userSemesterId);

        const { setSemesterDirectories } = useDirectoryStore.getState();
        setSemesterDirectories(
          getCurrentSemester()?.year!,
          getCurrentSemester()?.term!,
          data.directories
        );

        const convert = (files: MainPageResponse["recentFiles"]) =>
          (files ?? []).map((file) => ({
            id: file.id,
            title: file.title,
            previewLine: file.previewLine,
            description: file.previewLine,
            type: (file.type ?? "FILE") as Item["type"],
            category: file.tag?.tagName ?? "",
            isFavorite: file.favorite,
            isSelected: false,
            url: file.url,
            extension: file.extension,
            iconType: file.iconType,
          }));

        setRecentItems(convert(data.recentFiles));
        setFavoriteItems(convert(data.favoriteFiles));
      } catch (e) {
        console.error("메인페이지 데이터를 불러오지 못했습니다:", e);
      }
    };

    fetchMainPage();
  }, []);

  const handleToggleSelect = (id: number) => {
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

  const handleToggleFavorite = async (id: number) => {
    try {
      await toggleFavoriteResource(id);
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
    } catch (e) {
      console.error("즐겨찾기 토글 실패:", e);
    }
  };

  //todo : route 고쳐야 함
  const handleItemClick = (id: number) => {
    navigate(`/study/강의필기/${id}`);
  };

  return (
    <div className="w-full flex flex-col">
      <HomeSection />
      <div className="flex-1 px-6 py-3">
        <div className="px-4 justify-center text-black text-xl font-semibold font-pretendard">
          최근 업로드한 파일
        </div>
        {recentItems.length === 0 ? (
          <div className="px-4 py-2 text-gray-500">
            업로드한 파일이 없습니다.
          </div>
        ) : (
          <List
            items={recentItems}
            onToggleSelect={handleToggleSelect}
            onToggleFavorite={handleToggleFavorite}
            selectable={false}
            onClickItem={handleItemClick}
          />
        )}
      </div>
      <div className="flex-1 px-6">
        <div className="px-4 justify-center text-black text-xl font-semibold font-pretendard">
          즐겨찾기한 파일
        </div>
        {favoriteItems.length === 0 ? (
          <div className="px-4 py-2 text-gray-500">
            즐겨찾기한 파일이 없습니다.
          </div>
        ) : (
          <List
            items={favoriteItems}
            onToggleSelect={handleToggleSelect}
            onToggleFavorite={handleToggleFavorite}
            selectable={false}
            onClickItem={handleItemClick}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
