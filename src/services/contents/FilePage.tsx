import { type Item } from "../../types/Item";
import Gallery from "../../commons/gallery/Gallery";
import List from "../../commons/list/List";
import { useState } from "react";
import { useEffect } from "react";
import {
  getResourcesByDirectory,
  registerFileMeta,
  toggleFavoriteResource,
} from "../../api/File";
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
import { generateQuestions as generateQuestionsApi } from "../../api/Question";
import { useDirectoryStore } from "../../store/useDirectoryStore";

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
    "upload" | "generateQuestion" | "delete" | null
  >(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openFab) {
      resetSelection();
      setIsGenerating(true);
      setSelectableMode(true);
    }
  }, [location.state]);

  const { pathname } = useLocation();
  const pathSegments = pathname.split("/").filter(Boolean);
  const slug = params.slug ?? "";
  const slugParts = slug.split("-");
  const slugPrefix = pathSegments[pathSegments.length - 2];

  const { getCurrentDirectories } = useDirectoryStore.getState();
  const currentDirs = getCurrentDirectories();

  const resolveDirectoryId = (prefix: string, id: number): number => {
    const map: Record<string, string> = {
      study: "학업",
      subject: "과목",
    };
    const translated = map[prefix];
    if (!translated) return id;

    const baseDir = currentDirs.find((dir) => dir.name === translated);
    if (!baseDir) return id;

    const subDir = baseDir.children?.find((child) => child.id === id);
    return subDir ? subDir.id : id;
  };

  const directoryId = resolveDirectoryId(slugPrefix, Number(slugParts[1]));
  const allTags = useTagOptions();
  const baseDir = currentDirs.find((dir) => {
    const map: Record<string, string> = {
      study: "학업",
      subject: "과목",
    };
    return dir.name === map[slugPrefix];
  });

  const tagOptions = allTags.filter(
    (tag) => tag.parentDirectoryId !== baseDir?.id
  );

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await getResourcesByDirectory(directoryId);
        setItems(response);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };
    fetchResources();
  }, [params.directoryId, params.slug, directoryId]);

  const generateQuestions = async () => {
    setIsLoadingModalOpen(true);
    setConfirmType("generateQuestion");
    try {
      const selectedItems = items.filter(
        (item) =>
          item.isSelected && (item.type === "FILE" || item.type === "NOTE")
      );
      const requestPayload = selectedItems.map((item) => ({
        resourceId: item.id,
        type: item.type as "FILE" | "NOTE",
        tagId: Number(item.tag?.tagId),
      }));
      const res = await generateQuestionsApi(directoryId, requestPayload);
      setConfirmType("generateQuestion");
      setIsConfirmModalOpen(true);

      // Save questionId temporarily for navigation later
      sessionStorage.setItem("generatedQuestionId", String(res.questionId));
    } catch (e) {
      console.error("문제 생성 실패", e);
      alert("문제 생성에 실패했습니다.");
    } finally {
      setIsLoadingModalOpen(false);
    }
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

  const handleToggleFavorite = async (id: number) => {
    try {
      await toggleFavoriteResource(id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, favorite: !item.favorite } : item
        )
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleItemClick = (id: number) => {
    navigate(`${id}`);
  };

  const uploadFiles = async (
    files: FileList,
    directoryId: number,
    selectedTags?: { id: number }[]
  ): Promise<Item[]> => {
    const uploaded: Item[] = [];
    for (const file of Array.from(files)) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 90000); // 2 minutes
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
        tagId: selectedTags?.[0]?.id,
      });
      try {
        await fetch(url, {
          method: "PUT",
          body: file,
          signal: controller.signal,
        });
      } catch (e) {
        if (controller.signal.aborted) {
          alert(`${file.name} 업로드가 2분을 초과하여 취소되었습니다.`);
        } else {
          throw e;
        }
      } finally {
        clearTimeout(timeoutId);
      }
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
        favorite: false,
      });
    }
    return uploaded;
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
            setConfirmType("delete");
            setIsLoadingModalOpen(true);
            const selectedIds = items
              .filter((item) => item.isSelected)
              .map((item) => item.id);
            if (selectedIds.length === 0) return;

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
            setConfirmType("upload");
            setIsLoadingModalOpen(true);
            setIsTagModalOpen(false);
            if (!pendingFiles || selectedTags.length === 0) return;
            try {
              const uploaded = await uploadFiles(
                pendingFiles,
                directoryId,
                selectedTags
              );
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
            // If no tag options, skip tag modal and upload directly
            if (tagOptions.length === 0) {
              setConfirmType("upload");
              setIsLoadingModalOpen(true);
              try {
                const uploaded = await uploadFiles(files, directoryId);
                setItems((prev) => [...uploaded, ...prev]);
                setIsConfirmModalOpen(true);
                setConfirmType("upload");
              } catch (e) {
                console.error("업로드 실패", e);
                alert("파일 업로드에 실패했습니다.");
              } finally {
                setIsLoadingModalOpen(false);
              }
              return;
            }
            setPendingFiles(files);
            setIsTagModalOpen(true);
          }}
        />
      )}
      {isLoadingModalOpen && (
        <ProgressModal
          isOpen={isLoadingModalOpen}
          title={
            confirmType === "generateQuestion"
              ? "문제 생성 중..."
              : confirmType === "delete"
              ? "파일 삭제 중..."
              : "파일 업로드 중..."
          }
          description={
            confirmType === "generateQuestion"
              ? "잠시만 기다려주세요. AI가 문제를 생성하고 있어요."
              : confirmType === "delete"
              ? "삭제 중입니다. 잠시만 기다려주세요."
              : "업로드 중입니다. 잠시만 기다려주세요."
          }
        />
      )}
      {isConfirmModalOpen && (
        <AlertModal
          title={
            confirmType === "generateQuestion"
              ? "문제 생성이 완료되었습니다."
              : confirmType === "delete"
              ? "파일 삭제 완료"
              : "파일 업로드 완료"
          }
          description={
            confirmType === "generateQuestion"
              ? "선택한 노트를 기반으로 문제가 생성되었습니다. 생성된 문제를 확인하고 싶으시다면,\n이동 버튼을 클릭해주세요."
              : confirmType === "delete"
              ? "선택한 파일이 성공적으로 삭제되었습니다."
              : "파일 업로드가 성공적으로 완료되었습니다."
          }
          onConfirm={
            confirmType === "generateQuestion"
              ? () => {
                  setIsConfirmModalOpen(false);
                  const questionId = sessionStorage.getItem(
                    "generatedQuestionId"
                  );
                  if (questionId) {
                    navigate(`/question/${questionId}`);
                    sessionStorage.removeItem("generatedQuestionId");
                  }
                }
              : () => {
                  setIsConfirmModalOpen(false);
                }
          }
          {...(confirmType !== "upload" && {
            onCancel: () => setIsConfirmModalOpen(false),
            cancelText: "취소",
          })}
          confirmText={confirmType === "generateQuestion" ? "이동" : "확인"}
        />
      )}
    </div>
  );
}

export default FilePage;
