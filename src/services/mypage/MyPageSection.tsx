import Button from "@/commons/inputs/Button";

interface MyPageSectionProps {
  label: string;
  value: string;
  isEditing?: boolean;
  editValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  editElement?: React.ReactNode;
  editButtonText?: string;
  showEditButton?: boolean;
}

function MyPageSection({
  label,
  value,
  isEditing = false,
  editValue,
  onChange,
  onEdit,
  editElement,
  editButtonText,
  showEditButton,
}: MyPageSectionProps) {

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-4 py-3 border-y bg-white">
      <div className="flex flex-col w-full sm:flex-row items-start gap-2">
        <div className="text-primary min-w-[50px] text-lg font-semibold">
          {label}
        </div>
        {isEditing ? (
          editElement ? (
            editElement
          ) : (
            <input
              className="min-w-[100px] text-font text-lg border border-gray-500 border-solid rounded px-2 bg-white focus:border-primary focus:outline-none"
              value={editValue}
              onChange={onChange}
            />
          )
        ) : (
          <div className="min-w-[100px] px-2 text-font text-lg">{value}</div>
        )}
      </div>
      {showEditButton !== false && (
        <div className="w-32">
          <Button size="small" color="primary" onClick={onEdit}>
            {editButtonText ?? (isEditing ? "완료" : "수정")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyPageSection;
