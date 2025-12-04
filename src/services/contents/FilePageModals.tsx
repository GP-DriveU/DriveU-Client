import { useNavigate } from "react-router-dom";
import AlertModal from "@/commons/modals/AlertModal";
import ProgressModal from "@/commons/modals/ProgressModal";
import TagSelectModal from "@/commons/modals/TagSelectModal";
import UploadOverlay from "@/commons/modals/UploadOverlay";
import LinkInputModal from "@/commons/modals/LinkInputModal";

interface FilePageModalsProps {
  data: any; // useFilePageData 반환값
  modals: any; // useFilePageUI의 modals 객체
  actions: any; // useFilePageActions 반환값
}

const FilePageModals = ({ data, modals, actions }: FilePageModalsProps) => {
  const navigate = useNavigate();
  const { state, actions: modalActions } = modals;
  const { isOpen } = state;

  return (
    <>
      {isOpen.link && (
        <LinkInputModal
          isOpen={isOpen.link}
          onClose={() => modalActions.close("link")}
          onConfirm={(title, url) => {
            modalActions.close("link");
            if (
              data.tagOptions.length === 0 ||
              data.baseDir?.name === "대외활동"
            ) {
              actions.registerLink(title, url, null);
            } else {
              modalActions.setPendingLink({ title, url });
              modalActions.open("tag");
            }
          }}
        />
      )}

      {isOpen.tag && (
        <TagSelectModal
          isOpen={isOpen.tag}
          onClose={() => {
            modalActions.close("tag");
            modalActions.setPendingFiles(null);
            modalActions.setPendingLink(null);
          }}
          availableTags={data.tagOptions}
          onSave={async (selectedTags) => {
            modalActions.close("tag");
            const tagId = selectedTags?.[0]?.id || 0;

            if (state.pendingLinkData) {
              await actions.registerLink(
                state.pendingLinkData.title,
                state.pendingLinkData.url,
                tagId
              );
            } else if (state.pendingFiles) {
              await actions.uploadFiles(state.pendingFiles, selectedTags);
            }
          }}
        />
      )}

      {isOpen.upload && (
        <UploadOverlay
          onClose={() => modalActions.close("upload")}
          onUpload={async (files) => {
            if (!files) return;
            modalActions.close("upload");
            if (
              data.tagOptions.length === 0 ||
              data.baseDir?.name === "대외활동"
            ) {
              await actions.uploadFiles(files);
            } else {
              modalActions.setPendingFiles(files);
              modalActions.open("tag");
            }
          }}
        />
      )}

      {isOpen.loading && (
        <ProgressModal
          isOpen={isOpen.loading}
          title={
            state.confirmType === "generateQuestion"
              ? "문제 생성 중..."
              : state.confirmType === "delete"
              ? "파일 삭제 중..."
              : "처리 중..."
          }
          description="잠시만 기다려주세요."
        />
      )}

      {isOpen.confirm && (
        <AlertModal
          title="완료되었습니다"
          description={
            state.confirmType === "generateQuestion"
              ? "문제가 생성되었습니다. 이동하시겠습니까?"
              : "작업이 성공적으로 완료되었습니다."
          }
          onConfirm={() => {
            modalActions.close("confirm");
            if (state.confirmType === "generateQuestion") {
              const qId = sessionStorage.getItem("generatedQuestionId");
              if (qId) {
                navigate(`/question/${qId}`);
                sessionStorage.removeItem("generatedQuestionId");
              }
            }
          }}
          onCancel={() => modalActions.close("confirm")}
          confirmText={
            state.confirmType === "generateQuestion" ? "이동" : "확인"
          }
          cancelText="취소"
        />
      )}
    </>
  );
};

export default FilePageModals;
