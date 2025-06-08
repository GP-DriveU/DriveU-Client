import { type Item } from "../../types/Item";
import Gallery from "../../commons/gallery/Gallery";
import List from "../../commons/list/List";
import { useState } from "react";
import { useEffect } from "react";
import { getResourcesByDirectory, registerFileMeta } from "../../api/File";
import { deleteResource } from "../../api/File";
import AlertModal from "../../commons/modals/AlertModal";
import ProgressModal from "../../commons/modals/ProgressModal";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FABButton from "../../commons/fab/FABButton";
import TitleSection from "../../commons/section/TitleSection";
import IconFilter from "../../assets/icon/icon_filter.svg?react";
import IconGallery from "../../assets/icon/icon_grid.svg?react";
import IconList from "../../assets/icon/icon_list.svg?react";
import { useSemesterStore } from "../../store/useSemesterStore";
import UploadOverlay from "../../commons/modals/UploadOverlay";
import { getUploadPresignedUrl } from "../../api/File";
import TagSelectModal from "../../commons/modals/TagSelectModal";
import { useTagOptions } from "../../hooks/useTagOptions";

function FilePage() {
  const params = useParams();
  const category = params.slug ?? "파일";

  const { selectedSemesterKey } = useSemesterStore();

  const [items, setItems] = useState<Item[]>([]);
  const [viewMode, setViewMode] = useState<"gallery" | "list">("list");
  const [selectedIconId, setSelectedIconId] = useState<string>("three");
  const [selectableMode, setSelectableMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<
    "upload" | "generate" | "delete" | null
  >(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const tagOptions = useTagOptions();

  const slugParts = (params.slug ?? "").split("-");
  const directoryId = Number(slugParts[slugParts.length - 1]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await getResourcesByDirectory(directoryId);
        setItems(
          response.map((item: any) => ({
            id: item.id,
            type: item.type,
            title: item.title,
            url: item.url,
            previewLine: item.previewLine,
            description: item.previewLine,
            extension: item.extension ?? "",
            iconType: item.iconType ?? item.type,
            isSelected: false,
            isFavorite: item.favorite ?? false,
            tag: item.tag ?? null,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };
    fetchResources();
  }, [params.directoryId, params.slug, directoryId]);

  const generateQuestions = async () => {
    setIsLoadingModalOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoadingModalOpen(false);
    setIsConfirmModalOpen(true);
    setConfirmType("generate");
  };

  const iconItems = [
    { id: "one", icon: <IconFilter /> },
    { id: "two", icon: <IconGallery /> },
    { id: "three", icon: <IconList /> },
  ];

  const handleToggleSelect = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const resetSelection = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isSelected: false })));
  };

  const handleToggleFavorite = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleItemClick = (id: number) => {
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
          onUploadClick={() => {
            setIsUploadOpen(true);
          }}
          onStartDelete={async () => {
            const selectedIds = items
              .filter((item) => item.isSelected)
              .map((item) => item.id);
            if (selectedIds.length === 0) return;

            setIsLoadingModalOpen(true);
            try {
              await Promise.all(selectedIds.map((id) => deleteResource(id)));
              setItems((prev) =>
                prev.filter((item) => !selectedIds.includes(item.id))
              );
              setConfirmType("delete");
              setIsConfirmModalOpen(true);
            } catch (error) {
              console.error("Failed to delete selected items:", error);
              alert("일부 파일 삭제에 실패했습니다.");
            } finally {
              setIsLoadingModalOpen(false);
            }
          }}
          onWriteNoteClick={() => {
            navigate(`${location.pathname}/new`);
          }}
        />
      </div>
      {isTagModalOpen && (
        <TagSelectModal
          isOpen={isTagModalOpen}
          onClose={() => {
            setIsTagModalOpen(false);
            setPendingFiles(null);
          }}
          availableTags={tagOptions}
          onSave={async (selectedTags) => {
            setIsTagModalOpen(false);
            if (!pendingFiles || selectedTags.length === 0) return;
            setIsLoadingModalOpen(true);
            try {
              const uploaded: Item[] = [];
              for (const file of Array.from(pendingFiles)) {
                const filenameWithExtension = file.name;
                const { url, s3Path } = await getUploadPresignedUrl({
                  filename: decodeURIComponent(filenameWithExtension),
                  fileSize: file.size,
                });
                const extension =
                  filenameWithExtension.split(".").pop()?.toUpperCase() ?? "";
                const { fileId } = await registerFileMeta(directoryId, {
                  title: file.name,
                  s3Path,
                  extension,
                  size: file.size,
                  tagId: selectedTags[0].id,
                });
                await fetch(url, { method: "PUT", body: file });
                uploaded.push({
                  id: fileId,
                  type: "FILE",
                  title: file.name,
                  url,
                  previewLine: "새로 업로드된 파일입니다.",
                  description: "새로 업로드된 파일입니다.",
                  extension,
                  iconType: "FILE",
                  isSelected: false,
                  isFavorite: false,
                });
              }
              setItems((prev) => [...uploaded, ...prev]);
              setIsConfirmModalOpen(true);
              setConfirmType("upload");
            } catch (e) {
              console.error("업로드 실패", e);
              alert("파일 업로드에 실패했습니다.");
            } finally {
              setIsLoadingModalOpen(false);
            }
          }}
        />
      )}
      {isUploadOpen && (
        <UploadOverlay
          onClose={() => setIsUploadOpen(false)}
          onUpload={async (files) => {
            if (!files) return;
            setIsUploadOpen(false);
            setPendingFiles(files);
            setIsTagModalOpen(true);
          }}
        />
      )}
      {isLoadingModalOpen && (
        <ProgressModal
          isOpen={isLoadingModalOpen}
          title={
            confirmType === "generate" ? "문제 생성 중..." : "파일 업로드 중..."
          }
          description={
            confirmType === "generate"
              ? "잠시만 기다려주세요."
              : "업로드 중입니다. 잠시만 기다려주세요."
          }
        />
      )}
      {isConfirmModalOpen && (
        <AlertModal
          title={
            confirmType === "generate"
              ? "문제 생성이 완료되었습니다."
              : confirmType === "delete"
              ? "파일 삭제 완료"
              : "파일 업로드 완료"
          }
          description={
            confirmType === "generate"
              ? "선택한 노트를 기반으로 문제가 생성되었습니다. 생성된 문제를 확인하고 싶으시다면,\n이동 버튼을 클릭해주세요."
              : confirmType === "delete"
              ? "선택한 파일이 성공적으로 삭제되었습니다."
              : "파일 업로드가 성공적으로 완료되었습니다."
          }
          onConfirm={() => {
            setIsConfirmModalOpen(false);
            if (confirmType === "generate") {
              navigate("/question/1"); // TODO: replace with real ID
            }
          }}
          {...(confirmType !== "upload" && {
            onCancel: () => setIsConfirmModalOpen(false),
            cancelText: "취소",
          })}
          confirmText={confirmType === "generate" ? "이동" : "확인"}
        />
      )}
    </div>
  );
}

export default FilePage;
