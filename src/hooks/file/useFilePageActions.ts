import { useNavigate } from "react-router-dom";
import {
  registerFileMeta,
  deleteResource,
  getUploadPresignedUrl,
  registerLink,
  getLinkUrl,
} from "@/api/File";
import { generateQuestions as generateQuestionsApi } from "@/api/Question";
import { type Item } from "@/types/Item";
import { useStorageStore } from "@/store/useStorageStore";

interface ActionDeps {
  directoryId: number;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  modals: any;
}

export const useFilePageActions = ({
  directoryId,
  items,
  setItems,
  modals,
}: ActionDeps) => {
  const navigate = useNavigate();
  const { actions: modalActions } = modals;
  const { setRemainingStorage } = useStorageStore();

  const toggleItemSelection = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const resetSelection = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isSelected: false })));
  };

  const handleItemClick = async (id: number) => {
    const item = items.find((i) => i.id === Number(id));
    if (!item) return;

    if (item.type === "LINK") {
      try {
        const { url } = await getLinkUrl(item.id);
        const targetUrl = url.startsWith("http") ? url : `https://${url}`;
        window.open(targetUrl, "_blank");
      } catch {
        alert("링크를 열 수 없습니다.");
      }
    } else if (item.type === "NOTE") {
      navigate(`/study/강의필기-${directoryId}/${id}`);
    } else {
      return;
    }
  };

  const uploadFiles = async (
    files: FileList,
    selectedTags?: { id: number }[]
  ) => {
    modalActions.setLoading(true);
    modalActions.setConfirmType("upload");

    const uploaded: Item[] = [];

    for (const file of Array.from(files)) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 90000);
      const filenameWithExtension = file.name;
      const { url, s3Path } = await getUploadPresignedUrl({
        filename: decodeURIComponent(filenameWithExtension),
        fileSize: file.size,
      });
      const extension =
        filenameWithExtension.split(".").pop()?.toUpperCase() ?? "";

      try {
        await fetch(url, {
          method: "PUT",
          body: file,
          signal: controller.signal,
        });
        const { fileId, remainingStorage } = await registerFileMeta(
          directoryId,
          {
            title: file.name,
            s3Path,
            extension,
            size: file.size,
            tagId: selectedTags?.[0]?.id,
          }
        );
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
        setRemainingStorage(remainingStorage);
      } catch (e) {
        if (controller.signal.aborted) {
          alert(`${file.name} 업로드가 2분을 초과하여 취소되었습니다.`);
        } else {
          throw e;
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }
    setItems((prev) => [...uploaded, ...prev]);
    return uploaded;
  };

  const registerLinkAction = async (
    title: string,
    url: string,
    tagId: number
  ) => {
    modalActions.setLoading(true);
    modalActions.setConfirmType("link");
    try {
      const { linkId } = await registerLink(directoryId, { title, url, tagId });
      const newLinkItem: Item = {
        id: Number(linkId),
        type: "LINK",
        title,
        url,
        previewLine: "외부 링크",
        description: "외부 링크",
        extension: "LINK",
        iconType: "LINK",
        isSelected: false,
        favorite: false,
      };
      setItems((prev) => [newLinkItem, ...prev]);
      modalActions.open("confirm");
    } catch {
      alert("링크 등록 실패");
    } finally {
      modalActions.setLoading(false);
      modalActions.setPendingLink(null);
    }
  };

  const deleteItems = async () => {
    modalActions.setLoading(true);
    modalActions.setConfirmType("delete");
    const selectedIds = items.filter((i) => i.isSelected).map((i) => i.id);

    try {
      await Promise.all(selectedIds.map((id) => deleteResource(id)));
      setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      modalActions.open("confirm");
    } catch {
      alert("삭제 실패");
    } finally {
      modalActions.setLoading(false);
    }
  };

  const generateQuestions = async () => {
    modalActions.setLoading(true);
    modalActions.setConfirmType("generateQuestion");
    try {
      const selectedItems = items.filter(
        (item) => item.isSelected && ["FILE", "NOTE"].includes(item.iconType)
      );
      const payload = selectedItems.map((item) => ({
        resourceId: item.id,
        type: item.type as "FILE" | "NOTE",
        tagId: Number(item.tag?.tagId),
      }));
      const res = await generateQuestionsApi(directoryId, payload);
      sessionStorage.setItem("generatedQuestionId", String(res.questionId));
      modalActions.open("confirm");
    } catch {
      alert("문제 생성 실패");
    } finally {
      modalActions.setLoading(false);
    }
  };

  return {
    toggleItemSelection,
    resetSelection,
    handleItemClick,
    uploadFiles,
    registerLink: registerLinkAction,
    deleteItems,
    generateQuestions,
  };
};
