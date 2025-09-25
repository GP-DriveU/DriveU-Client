import React from "react";
import Button from "@/commons/inputs/Button";

interface AlertModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDanger?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
  isDanger = false,
  confirmText,
  cancelText,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="w-full max-w-md px-6 py-6 bg-white rounded-xl flex flex-col items-center gap-6">
        <div className="w-full text-center flex flex-col gap-4">
          <div
            className={`text-2xl font-bold ${
              isDanger ? "text-danger" : "text-primary"
            }`}
          >
            {title}
          </div>
          <div
            className="text-base text-black font-normal"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <div className="w-full flex justify-center gap-4">
          {onCancel && (
            <Button
              color="primary"
              size="medium"
              onClick={onCancel}
              className="w-[130px] h-[55px] rounded-[15px]"
            >
              {cancelText || "취소"}
            </Button>
          )}
          <Button
            color={isDanger ? "danger" : "primary"}
            size="medium"
            onClick={onConfirm}
            className="w-[130px] h-[55px] rounded-[15px]"
          >
            {confirmText || "삭제"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
