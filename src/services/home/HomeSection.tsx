import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Button from "../../commons/inputs/Button";
import UploadOverlay from "../../commons/modals/UploadOverlay";
import { useDirectoryStore } from "../../store/useDirectoryStore";
import TagSelectModal from "../../commons/modals/TagSelectModal";
import { getUploadPresignedUrl, registerFileMeta } from "../../api/File";
import type { Item } from "../../types/Item";
import ProgressModal from "../../commons/modals/ProgressModal";
import { useTagOptions } from "../../hooks/useTagOptions";
import LocalModal from "../../commons/modals/Modal";
import AlertModal from "../../commons/modals/AlertModal";

function HomeSection() {
  const navigate = useNavigate();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const dir = useDirectoryStore().getCurrentDirectories();
  const [selectedDirectoryId, setSelectedDirectoryId] = useState<number | null>(
    null
  );
  const allTags = useTagOptions();
  const tagOptions = useMemo(() => {
    const baseDir = dir.find((d) =>
      d.children?.some((c) => c.id === selectedDirectoryId)
    );
    return allTags.filter((tag) => tag.parentDirectoryId !== baseDir?.id);
  }, [allTags, selectedDirectoryId, dir]);

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<string>("");
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [_items, setItems] = useState<Item[]>([]);

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
      }, 90000); // 90 seconds timeout
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
    <div className="w-full flex flex-col items-center gap-10 my-16">
      <div className="flex flex-row text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#223a58] font-pretendard">
          DriveU
        </h1>
        <p className="text-lg md:text-2xl text-font font-normal font-pretendard mt-2">
          에 오신 것을 환영합니다.
        </p>
      </div>
      <div className="min-w-[450px] gap-10 h-14 flex flex-row">
        <Button
          size="medium"
          color="primary"
          onClick={() => {
            setIsDirectoryModalOpen(true);
            setConfirmType("upload");
          }}
        >
          파일 업로드
        </Button>
        <Button
          size="medium"
          color="secondary"
          onClick={() => navigate("/question")}
        >
          생성된 AI 문제
        </Button>
      </div>
      {isUploadOpen && (
        <UploadOverlay
          onClose={() => {
            setIsUploadOpen(false);
            if (selectedDirectoryId === null) {
              setIsDirectoryModalOpen(true);
            }
          }}
          onUpload={async (files) => {
            if (!files) return;
            setIsUploadOpen(false);
            setIsDirectoryModalOpen(false);
            if (tagOptions.length === 0 && selectedDirectoryId !== null) {
              setIsLoadingModalOpen(true);
              try {
                const uploaded = await uploadFiles(files, selectedDirectoryId);
                setItems((prev) => [...prev, ...uploaded]);
                setIsConfirmModalOpen(true);
                setConfirmType("upload");
              } catch (e) {
                console.error("업로드 실패", e);
                alert("파일 업로드에 실패했습니다.");
              } finally {
                setIsLoadingModalOpen(false);
              }
            } else {
              setPendingFiles(files);
              setIsTagModalOpen(true);
            }
          }}
        />
      )}
      {isDirectoryModalOpen && (
        <LocalModal
          onClose={() => setIsDirectoryModalOpen(false)}
          title="디렉토리 선택"
        >
          <div className="flex flex-col gap-4">
            {dir.map((parentDir) => (
              <div key={parentDir.id} className="flex flex-col gap-2">
                <div className="px-4 py-2 bg-secondary text-white rounded font-semibold text-center">
                  {parentDir.name}
                </div>
                {parentDir.children?.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {parentDir.children.map((childDir: any) => (
                      <Button
                        key={childDir.id}
                        color="primary"
                        size="small"
                        onClick={() => {
                          setSelectedDirectoryId(childDir.id);
                          setIsDirectoryModalOpen(false);
                          setIsUploadOpen(true);
                        }}
                      >
                        {childDir.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </LocalModal>
      )}
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
            if (
              !pendingFiles ||
              selectedTags.length === 0 ||
              selectedDirectoryId === null
            )
              return;
            setIsLoadingModalOpen(true);
            try {
              const uploaded = await uploadFiles(
                pendingFiles,
                selectedDirectoryId,
                selectedTags
              );
              setItems((prev) => [...prev, ...uploaded]);
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
            confirmType === "upload" ? "파일 업로드 완료" : "문제 생성 완료"
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

export default HomeSection;
