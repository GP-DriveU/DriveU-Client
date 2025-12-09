import { useEffect, useState } from "react";
import { IconFilter } from "@/assets";
import Filter from "@/commons/filter/Filter";
import TitleSection from "@/commons/section/TitleSection";
import Sort from "@/commons/sorting/Sort";
import {
  TRASH_SORT_FIELDS,
  type SortOption,
  type TrashSortField,
} from "@/types/sort";
import { FILE_TYPE_OPTIONS } from "@/types/trash";
import type { TrashItem, ItemType } from "@/types/Item";
import TrashList from "@/commons/list/TrashList";
import Button from "@/commons/inputs/Button";
import AlertModal from "@/commons/modals/AlertModal";
import {
  deleteTrashDirectory,
  deleteTrashFile,
  emptyTrash,
  getTrashItems,
  restoreDirectory,
  restoreFile,
} from "@/api/Trash";
import type { TrashSortType } from "@/types/trash";
import { useDirectoryStore } from "@/store/useDirectoryStore";
import { useSemesterStore } from "@/store/useSemesterStore";
import { useStorageStore } from "@/store/useStorageStore";

// todo: 나중에 modal refactor 필요
interface ModalData {
  title: string;
  description: string;
  confirmText?: string;
  onConfirm: () => void;
}

const sortOptionToSortType = (
  sortOption: SortOption<TrashSortField>
): TrashSortType => {
  const fieldMap: Record<TrashSortField, string> = {
    deleteDate: "deletedAt",
    name: "name",
  };
  const field = fieldMap[sortOption.field];
  return `${field},${sortOption.order}` as TrashSortType;
};

function TrashPage() {
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const iconItems = [{ id: "filter-icon", icon: <IconFilter /> }];
  const [sortOption, setSortOption] = useState<SortOption<TrashSortField>>({
    field: "deleteDate",
    order: "desc",
  });
  const [activeFilters, setActiveFilters] = useState<string[]>(["all"]);
  const { fetchAndUpdateDirectories } = useDirectoryStore();
  const { selectedSemesterKey } = useSemesterStore();
  const { semesters } = useSemesterStore();
  const { setRemainingStorage } = useStorageStore();

  const loadTrashItems = async () => {
    setIsLoading(true);
    try {
      const apiSort = sortOptionToSortType(sortOption);
      const response = await getTrashItems(activeFilters, apiSort);

      const formattedData = response.resources.map((item) => ({
        ...item,
        type: item.type as ItemType,
      }));
      setTrashItems(formattedData);
    } catch (error) {
      console.error("휴지통 데이터를 불러오는 데 실패했습니다:", error);
      setTrashItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrashItems();
  }, [sortOption, activeFilters]);

  const handleFilterChange = (newFilters: string[]) => {
    if (newFilters.length === 0) {
      setActiveFilters(["all"]);
      return;
    }

    setActiveFilters(newFilters);
  };

  const handleFilterToggle = () => {
    if (trashItems.length > 0) {
      setIsFilterVisible((prev) => !prev);
    }
  };

  const handleRestoreItem = async (item: TrashItem) => {
    try {
      if (item.type === "DIRECTORY") {
        await restoreDirectory(item.id);
      } else {
        await restoreFile(item.id);
      }

      alert(`'${item.name}' 파일 복원이 완료되었습니다.`);
      await loadTrashItems();

      if (selectedSemesterKey) {
        const [yearStr, term] = selectedSemesterKey.split("-");
        const year = parseInt(yearStr, 10);

        const targetSemester = semesters.find(
          (s) => s.year === year && s.term === term
        );
        const targetSemesterId = targetSemester?.userSemesterId ?? 0;

        if (targetSemesterId > 0) {
          await fetchAndUpdateDirectories(targetSemesterId, year, term);
        } else {
          console.warn("userSemesterId가 없어 디렉토리 갱신을 건너뜁니다.");
        }
      }
    } catch (error) {
      console.error("파일 복원에 실패했습니다:", error);
      alert(`'${item.name}' 복원 중 오류가 발생했습니다.`);
    }
  };

  const handleDeleteItemClick = (item: TrashItem) => {
    const itemType = item.type === "DIRECTORY" ? "디렉토리" : "파일";
    setModalData({
      title: `${itemType} 영구 삭제`,
      description: `<b>'${item.name}'</b> ${itemType}을(를)<br/>영구적으로 삭제하시겠습니까?<br/>이 작업은 되돌릴 수 없습니다.`,
      confirmText: "삭제",
      onConfirm: () => confirmDeleteItem(item),
    });
  };

  const handleEmptyTrashClick = () => {
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

  const confirmDeleteItem = async (item: TrashItem) => {
    try {
      const response =
        item.type === "DIRECTORY"
          ? await deleteTrashDirectory(item.id)
          : await deleteTrashFile(item.id);

      if (response && typeof response.remainingStorage === "number") {
        setRemainingStorage(response.remainingStorage);
      }

      closeModal();
      await loadTrashItems();
    } catch (error) {
      console.error("항목 영구 삭제에 실패했습니다:", error);
      closeModal();
    }
  };

  const confirmEmptyTrash = async () => {
    try {
      const response = await emptyTrash();

      if (response && typeof response.remainingStorage === "number") {
        setRemainingStorage(response.remainingStorage);
      }

      closeModal();
      await loadTrashItems();
    } catch (error) {
      console.error("휴지통 비우기에 실패했습니다:", error);
      closeModal();
    }
  };

  return (
    <div className="w-full h-full flex bg-white flex-col items-center">
      <TitleSection
        title="휴지통"
        items={iconItems}
        onIconClick={handleFilterToggle}
        selectedId={isFilterVisible ? "filter-icon" : undefined}
        isIconDisabled={trashItems.length === 0 && !isLoading}
      />
      {isFilterVisible && (
        <div className="w-full bg-white flex flex-row gap-16 px-12 mb-4">
          <Sort
            sortOption={sortOption}
            onSortChange={setSortOption}
            fieldOptions={TRASH_SORT_FIELDS}
          />
          <Filter
            title="파일 형식"
            options={FILE_TYPE_OPTIONS}
            selectedFilters={activeFilters}
            onFilterChange={handleFilterChange}
            allKey="all"
          />
        </div>
      )}

      <div className="w-full flex-1 px-6 pb-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>데이터를 불러오는 중입니다...</p>
          </div>
        ) : (
          <TrashList
            items={trashItems}
            onRestore={handleRestoreItem}
            onDelete={handleDeleteItemClick}
          />
        )}
      </div>

      <div className="w-48 mb-24">
        <Button
          color="danger"
          size="medium"
          onClick={handleEmptyTrashClick}
          disabled={trashItems.length === 0 || isLoading}
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
