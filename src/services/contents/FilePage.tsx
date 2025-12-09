import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FABButton from "@/commons/fab/FABButton";
import TitleSection from "@/commons/section/TitleSection";
import Gallery from "@/commons/gallery/Gallery";
import MainFileList from "@/commons/list/MainFileList";
import Sort from "@/commons/sorting/Sort";
import FilePageModals from "./FilePageModals";
import FilePreviewModal from "@/commons/modals/FilePreviewModal";
import { IconFilter, IconGallery, IconList } from "@/assets";
import { toggleFavoriteResource } from "@/api/File";
import { useFilePageController } from "@/hooks/file/useFilePageController";
import Filter from "@/commons/filter/Filter";
import {
  FAVORITE_OPTIONS,
  FILE_SORT_FIELDS,
  LINK_TYPE_OPTIONS,
} from "@/types/sort";

function FilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, ui, modals, actions } = useFilePageController();

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    setIsFilterVisible(false);
  }, [data.directoryId]);

  const iconItems = [
    { id: "one", icon: <IconFilter /> },
    { id: "two", icon: <IconGallery /> },
    { id: "three", icon: <IconList /> },
  ];

  const activeIconIds = useMemo(() => {
    const ids: string[] = [];
    if (isFilterVisible) ids.push("one");
    if (ui.viewMode === "gallery") ids.push("two");
    if (ui.viewMode === "list") ids.push("three");
    return ids;
  }, [isFilterVisible, ui.viewMode]);

  const handleToggleFavorite = async (id: number) => {
    try {
      await toggleFavoriteResource(id);
      data.setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, favorite: !item.favorite } : item
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleIconClick = (id: string) => {
    if (id === "one") {
      setIsFilterVisible((prev) => !prev);
    } else if (id === "two") {
      ui.setViewMode("gallery");
    } else if (id === "three") {
      ui.setViewMode("list");
    }
  };

  return (
    <div className="w-full flex bg-white flex-col">
      <TitleSection
        title={data.category.replace(/-\d+$/, "")}
        semester={
          data.selectedSemesterKey
            ? (() => {
                const [year, term] = data.selectedSemesterKey.split("-");
                return `${year}년 ${term === "SPRING" ? "1" : "2"}학기`;
              })()
            : ""
        }
        items={iconItems}
        selectedIds={activeIconIds}
        onIconClick={handleIconClick}
        isIconDisabled={data.items.length === 0}
      />

      {isFilterVisible && (
        <div className="w-full bg-white flex flex-col md:flex-row gap-6 px-12 mb-4 border-b pb-4 border-gray-100">
          <div className="flex flex-col gap-4">
            <Filter
              title="보기 옵션"
              options={FAVORITE_OPTIONS}
              selectedFilters={data.favoriteFilter}
              onFilterChange={actions.setFavoriteFilter}
              allKey="all"
            />
            <Filter
              title="링크 타입"
              options={LINK_TYPE_OPTIONS}
              selectedFilters={data.linkTypeFilter}
              onFilterChange={actions.setLinkTypeFilter}
              allKey="ALL"
            />
          </div>

          <div className="flex-shrink-0">
            <Sort
              sortOption={data.sortOption}
              onSortChange={actions.setSortOption}
              fieldOptions={FILE_SORT_FIELDS}
            />
          </div>
        </div>
      )}
      <div className="w-full px-6">
        {ui.viewMode === "gallery" ? (
          <Gallery
            items={data.items}
            onToggleSelect={actions.toggleItemSelection}
            onToggleFavorite={handleToggleFavorite}
            selectable={ui.isSelectable}
            onClickItem={actions.handleItemClick}
          />
        ) : (
          <MainFileList
            items={data.items}
            onToggleSelect={actions.toggleItemSelection}
            onToggleFavorite={handleToggleFavorite}
            selectable={ui.isSelectable}
            onClickItem={actions.handleItemClick}
          />
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <FABButton
          isGenerating={ui.isGenerating}
          isSelecting={ui.isSelectable}
          onStartGenerating={() => {
            actions.resetSelection();
            ui.setIsGenerating(true);
            ui.setSelectableMode(true);
          }}
          onCancelGenerating={() => {
            actions.resetSelection();
            ui.setIsGenerating(false);
            ui.setSelectableMode(false);
          }}
          onSubmitGenerating={() => {
            actions.resetSelection();
            actions.generateQuestions();
            ui.setIsGenerating(false);
            ui.setSelectableMode(false);
          }}
          onStartSelecting={() => {
            actions.resetSelection();
            ui.setSelectableMode(true);
          }}
          onCancelSelecting={() => {
            actions.resetSelection();
            ui.setSelectableMode(false);
          }}
          onUploadClick={() => modals.actions.open("upload")}
          onLinkClick={() => modals.actions.open("link")}
          onStartDelete={actions.deleteItems}
          onWriteNoteClick={() => navigate(`${location.pathname}/new`)}
        />
      </div>

      <FilePageModals data={data} modals={modals} actions={actions} />
      <FilePreviewModal />
    </div>
  );
}

export default FilePage;
