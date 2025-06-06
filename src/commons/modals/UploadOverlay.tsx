import React, { useCallback } from "react";

type UploadOverlayProps = {
  onClose: () => void;
  onUpload: (files: FileList) => void;
};

const UploadOverlay: React.FC<UploadOverlayProps> = ({ onClose, onUpload }) => {
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer.files.length > 0) {
        onUpload(event.dataTransfer.files);
      }
      onClose();
    },
    [onUpload, onClose]
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      onUpload(event.target.files);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-[1000]"
      onClick={onClose}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div
        className="bg-white w-[30%] min-w-[300px] px-8 py-10 rounded-[14px] shadow-lg flex flex-col items-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xl font-semibold text-font text-center leading-relaxed">
          파일을 드래그하거나
          <br />
          클릭하여 업로드하세요
        </p>
        <label className="cursor-pointer bg-secondary hover:bg-secondary/70 text-white px-4 py-2 rounded-[8px] text-sm font-medium transition-colors duration-150">
          내 PC에서 파일 업로드
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default UploadOverlay;
