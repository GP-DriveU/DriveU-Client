import React from "react";
import Button from "../inputs/Button";

interface DirectoryAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  newDirName: string;
  setNewDirName: (name: string) => void;
  items: { name: string }[];
}

const DirectoryAddModal: React.FC<DirectoryAddModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newDirName,
  setNewDirName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-pretendard">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-semibold mb-4">새 디렉토리 추가</h2>
        <input
          type="text"
          value={newDirName}
          onChange={(e) => setNewDirName(e.target.value)}
          placeholder="디렉토리 이름 입력"
          className="w-full px-1 py-2 rounded mb-4"
        />
        <div className="flex w-48 ml-auto gap-2">
          <Button color="primary" onClick={onClose}>
            취소
          </Button>
          <Button color="secondary" onClick={() => onSubmit(newDirName)}>
            추가
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DirectoryAddModal;
