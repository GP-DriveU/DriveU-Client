import { useState } from "react";
import LocalModal from "@/commons/modals/Modal";
import Button from "@/commons/inputs/Button";

interface LinkInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string, url: string) => void;
}

const LinkInputModal = ({
  isOpen,
  onClose,
  onConfirm,
}: LinkInputModalProps) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  if (!isOpen) return null;

  return (
    <LocalModal title="링크 추가" onClose={onClose}>
      <div className="flex flex-col gap-4 w-full min-w-[300px]">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">제목</label>
          <input
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="링크 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">URL</label>
          <input
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button size="small" color="secondary" onClick={onClose}>
            취소
          </Button>
          <Button
            size="small"
            color="primary"
            disabled={!title || !url}
            onClick={() => onConfirm(title, url)}
          >
            등록
          </Button>
        </div>
      </div>
    </LocalModal>
  );
};

export default LinkInputModal;
