import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/commons/inputs/Button";
import LocalModal from "@/commons/modals/Modal";
import { useDirectoryStore } from "@/store/useDirectoryStore";
import { useTagOptions } from "@/hooks/useTagOptions";
import { useFilePageUI } from "@/hooks/file/useFilePageUI";
import { useFilePageActions } from "@/hooks/file/useFilePageActions";
import { type Item } from "@/types/Item";
import FilePageModals from "@/services/contents/FilePageModals";

function HomeSection() {
  const navigate = useNavigate();

  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [selectedDirectoryId, setSelectedDirectoryId] = useState<number | null>(
    null
  );
  const [pendingAction, setPendingAction] = useState<"upload" | "link" | null>(
    null
  );
  const [dummyItems, setDummyItems] = useState<Item[]>([]);

  const dir = useDirectoryStore().getCurrentDirectories();
  const allTags = useTagOptions();

  const baseDir = useMemo(
    () =>
      dir.find((d) => d.children?.some((c) => c.id === selectedDirectoryId)),
    [dir, selectedDirectoryId]
  );

  const tagOptions = useMemo(() => {
    return allTags.filter((tag) => tag.parentDirectoryId !== baseDir?.id);
  }, [allTags, baseDir]);

  const { modals } = useFilePageUI();

  const actions = useFilePageActions({
    directoryId: selectedDirectoryId || 0,
    items: dummyItems,
    setItems: setDummyItems,
    modals: modals,
  });

  const handleDirectorySelect = (id: number) => {
    setSelectedDirectoryId(id);
    setIsDirectoryModalOpen(false);

    if (pendingAction === "upload") {
      modals.actions.open("upload");
    } else if (pendingAction === "link") {
      modals.actions.open("link");
    }
    setPendingAction(null);
  };

  const adapterData = {
    tagOptions,
    baseDir: { name: baseDir?.name },
    setItems: setDummyItems,
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
            setPendingAction("upload");
            setIsDirectoryModalOpen(true);
          }}
        >
          파일 업로드
        </Button>
        <Button
          size="medium"
          color="primary"
          onClick={() => {
            setPendingAction("link");
            setIsDirectoryModalOpen(true);
          }}
        >
          링크 추가
        </Button>
        <Button
          size="medium"
          color="secondary"
          onClick={() => navigate("/question")}
        >
          생성된 AI 문제
        </Button>
      </div>

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
                        onClick={() => handleDirectorySelect(childDir.id)}
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
      <FilePageModals data={adapterData} modals={modals} actions={actions} />
    </div>
  );
}

export default HomeSection;
