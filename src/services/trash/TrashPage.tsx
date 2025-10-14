import { useEffect, useState } from "react";
import { IconFilter } from "@/assets";
import Filter from "@/commons/filter/Filter";
import TitleSection from "@/commons/section/TitleSection";
import Sort from "@/commons/sorting/Sort";
import type { SortOption } from "@/types/sort";
import { FILE_TYPE_OPTIONS } from "@/types/trash";
import type { TrashItem } from "@/types/Item";
import TrashList from "@/commons/list/TrashList";
import Button from "@/commons/inputs/Button";
import AlertModal from "@/commons/modals/AlertModal";

const DUMMY_TRASH_DATA: TrashItem[] = [
  {
    id: 201,
    name: "객체지향 프로그래밍 강의노트.md",
    type: "NOTE",
    deletedAt: "2024-06-01",
  },
  {
    id: 202,
    name: "2024년 1학기 성적표.pdf",
    type: "FILE",
    deletedAt: "2024-06-01",
  },
  {
    id: 203,
    name: "팀프로젝트 참고자료",
    type: "DIRECTORY",
    deletedAt: "2024-06-01",
  },
  {
    id: 204,
    name: "졸업과제 관련 링크",
    type: "LINK",
    deletedAt: "2024-06-01",
  },
];

// todo: 나중에 modal refactor 필요
interface ModalData {
  title: string;
  description: string;
  confirmText?: string;
  onConfirm: () => void;
}

const fetchTrashItems = async (
  sortOption: SortOption,
  filters: string[]
): Promise<TrashItem[]> => {
  console.log("[API 요청] 휴지통 데이터 요청:", { sortOption, filters });
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (Math.random() > 0.5) {
    console.log("[API 응답] 데이터:", DUMMY_TRASH_DATA);
    return Promise.resolve(DUMMY_TRASH_DATA);
  } else {
    console.log("[API 응답] 데이터 없음 (빈 배열)");
    return Promise.resolve([]);
  }
};

function TrashPage() {
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const iconItems = [{ id: "filter-icon", icon: <IconFilter /> }];
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "deleteDate",
    order: "asc",
  });
  const [activeFilters, setActiveFilters] = useState<string[]>(["all"]);

  useEffect(() => {
    fetchTrashItems(sortOption, activeFilters)
      .then((data) => {
        setTrashItems(data);
      })
      .catch((error) => {
        console.error("휴지통 데이터를 불러오는 데 실패했습니다:", error);
        setTrashItems([]);
      });
  }, [sortOption, activeFilters]);

  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
  };

  const handleFilterToggle = () => {
    if (trashItems.length > 0) {
      setIsFilterVisible((prev) => !prev);
    }
  };

  const handleRestore = (id: number) => {
    console.log(`[복원] 아이템 ID: ${id}`);
    setTrashItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleDeleteItem = (item: TrashItem) => {
    const itemType = item.type === "DIRECTORY" ? "디렉토리" : "파일";
    setModalData({
      title: `${itemType} 영구 삭제`,
      description: `<b>'${item.name}'</b> ${itemType}을(를)<br/>영구적으로 삭제하시겠습니까?<br/>이 작업은 되돌릴 수 없습니다.`,
      confirmText: "삭제",
      onConfirm: () => confirmDeleteItem(item.id),
    });
  };

  const handleEmptyTrash = () => {
    if (trashItems.length === 0) return;

    setModalData({
      title: "휴지통 비우기",
      description:
        "휴지통의 모든 항목을 영구적으로 삭제하시겠습니까?<br/>이 작업은 되돌릴 수 없습니다.",
      confirmText: "모두 삭제",
      onConfirm: confirmEmptyTrash,
    });
  };

  const closeModal = () => {
    setModalData(null);
  };

  const confirmDeleteItem = (id: number) => {
    console.log(`[영구 삭제] 아이템 ID: ${id}`);
    setTrashItems((prevItems) => prevItems.filter((item) => item.id !== id));
    closeModal();
  };

  const confirmEmptyTrash = () => {
    console.log("[영구 삭제] 휴지통의 모든 아이템");
    setTrashItems([]);
    closeModal();
  };

  return (
    <div className="w-full h-full flex bg-white flex-col items-center">
      <TitleSection
        title="휴지통"
        items={iconItems}
        onIconClick={handleFilterToggle}
        selectedId={isFilterVisible ? "filter-icon" : undefined}
        isIconDisabled={trashItems.length === 0}
      />
      {isFilterVisible && (
        <div className="w-full bg-white flex flex-row gap-16 px-12 mb-4">
          <Sort sortOption={sortOption} onSortChange={handleSortChange} />
          <Filter
            title="파일 형식"
            options={FILE_TYPE_OPTIONS}
            selectedFilters={activeFilters}
            onFilterChange={setActiveFilters}
            allKey="all"
          />
        </div>
      )}

      <div className="w-full flex-1 px-6 pb-6">
        <TrashList
          items={trashItems}
          onRestore={handleRestore}
          onDelete={handleDeleteItem}
        />
      </div>

      <div className="w-48 mb-24">
        <Button
          color="danger"
          size="medium"
          onClick={handleEmptyTrash}
          disabled={trashItems.length === 0}
        >
          휴지통 비우기
        </Button>
      </div>

      {modalData && (
        <AlertModal
          title={modalData.title}
          description={modalData.description}
          onConfirm={modalData.onConfirm}
          onCancel={closeModal}
          isDanger={true}
          confirmText={modalData.confirmText}
        />
      )}
    </div>
  );
}

export default TrashPage;