import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FABButton from "@/commons/fab/FABButton";
import TitleSection from "@/commons/section/TitleSection";
import Gallery from "@/commons/gallery/Gallery";
import MainFileList from "@/commons/list/MainFileList";
import { IconFilter, IconGallery, IconList } from "@/assets";
import { toggleFavoriteResource } from "@/api/File";
import { useFilePageController } from "@/hooks/file/useFilePageController";
import FilePageModals from "./FilePageModals";
import FilePreviewModal from "@/commons/modals/FilePreviewModal";

function FilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, ui, modals, actions } = useFilePageController();

  const [selectedIconId, setSelectedIconId] = useState<string>("three");

  const iconItems = [
    { id: "one", icon: <IconFilter /> },
    { id: "two", icon: <IconGallery /> },
    { id: "three", icon: <IconList /> },
  ];

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
        selectedId={selectedIconId}
        onIconClick={(id) => {
          setSelectedIconId(id);
          if (id === "two") ui.setViewMode("gallery");
          else if (id === "three") ui.setViewMode("list");
        }}
      />

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
