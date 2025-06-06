import { type Item } from "../../types/Item";
import Gallery from "../../commons/gallery/Gallery";
import List from "../../commons/list/List";
import { useState } from "react";
import AlertModal from "../../commons/modals/AlertModal";
import ProgressModal from "../../commons/modals/ProgressModal";
import { useNavigate, useParams } from "react-router-dom";
import FABButton from "../../commons/fab/FABButton";
import TitleSection from "../../commons/section/TitleSection";
import IconFilter from "../../assets/icon/icon_filter.svg?react";
import IconGallery from "../../assets/icon/icon_grid.svg?react";
import IconList from "../../assets/icon/icon_list.svg?react";
import { useSemesterStore } from "../../store/useSemesterStore";

function FilePage() {
  const params = useParams();
  console.log(params);
  const category = params.slug ?? "파일";

  const { selectedSemesterKey } = useSemesterStore();

  const dummyItems: Item[] = [
    {
      id: "1",
      title: "운영체제_강의노트",
      description: "최근에 작성된 운영체제 강의노트입니다.",
      type: "NOTE",
      categories: ["객지론"],
      isSelected: false,
      isFavorite: false,
    },
    {
      id: "2",
      title: "컴구_과제1",
      description: "컴퓨터구조 과제입니다.",
      type: "NOTE",
      categories: ["객지론"],
      isSelected: false,
      isFavorite: true,
    },
    {
      id: "3",
      title: "알고리즘_정리",
      description: "알고리즘에 대한 정리입니다.",
      type: "NOTE",
      categories: ["객지론"],
      isSelected: false,
      isFavorite: true,
    },
  ];

  const [items, setItems] = useState<Item[]>(dummyItems);
  const [viewMode, setViewMode] = useState<"gallery" | "list">("list");
  const [selectedIconId, setSelectedIconId] = useState<string>("three");
  const [selectableMode, setSelectableMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const navigate = useNavigate();

  // Mock async function for generating questions
  const generateQuestions = async () => {
    setIsLoadingModalOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoadingModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const iconItems = [
    { id: "one", icon: <IconFilter /> },
    { id: "two", icon: <IconGallery /> },
    { id: "three", icon: <IconList /> },
  ];

  const handleToggleSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  // Helper to reset all selections
  const resetSelection = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isSelected: false })));
  };

  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleItemClick = (id: string) => {
    navigate(`${id}`);
  };

  return (
    <div className="w-full flex bg-white flex-col">
      <TitleSection
        title={category.replace(/-\d+$/, "")}
        semester={
          selectedSemesterKey
            ? (() => {
                const [year, term] = selectedSemesterKey.split("-");
                return `${year}년 ${term === "SPRING" ? "1" : "2"}학기`;
              })()
            : ""
        }
        items={iconItems}
        selectedId={selectedIconId}
        onIconClick={(id) => {
          setSelectedIconId(id);
          if (id === "two") setViewMode("gallery");
          else if (id === "three") setViewMode("list");
        }}
      />
      <div className="w-full px-6">
        {viewMode === "gallery" ? (
          <Gallery
            items={items}
            onToggleSelect={handleToggleSelect}
            onToggleFavorite={handleToggleFavorite}
            selectable={selectableMode}
            onClickItem={handleItemClick}
          />
        ) : (
          <List
            items={items}
            onToggleSelect={handleToggleSelect}
            onToggleFavorite={handleToggleFavorite}
            selectable={selectableMode}
            onClickItem={handleItemClick}
          />
        )}
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <FABButton
          isGenerating={isGenerating}
          isSelecting={selectableMode}
          onStartGenerating={() => {
            resetSelection();
            setIsGenerating(true);
            setSelectableMode(true);
          }}
          onCancelGenerating={() => {
            resetSelection();
            setIsGenerating(false);
            setSelectableMode(false);
          }}
          onSubmitGenerating={() => {
            resetSelection();
            generateQuestions();
            setIsGenerating(false);
            setSelectableMode(false);
          }}
          onCancelSelecting={() => {
            resetSelection();
            setSelectableMode(false);
          }}
          onStartSelecting={() => {
            resetSelection();
            setSelectableMode(true);
          }}
        />
      </div>
      {isLoadingModalOpen && (
        <ProgressModal
          isOpen={isLoadingModalOpen}
          title="문제 생성 중..."
          description="잠시만 기다려주세요."
        />
      )}
      {isConfirmModalOpen && (
        <AlertModal
          title="문제 생성이 완료되었습니다."
          description="선택한 노트를 기반으로 문제가 생성되었습니다. 생성된 문제를 확인하고 싶으시다면,
이동 버튼을 클릭해주세요."
          onConfirm={() => {
            setIsConfirmModalOpen(false);
            navigate("/question/1"); // TODO: replace with real ID
          }}
          onCancel={() => setIsConfirmModalOpen(false)}
          confirmText="이동"
          cancelText="취소"
        />
      )}
    </div>
  );
}

export default FilePage;
