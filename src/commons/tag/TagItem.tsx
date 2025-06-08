import React from "react";
import IconX from "../../assets/icon/icon_x.svg?react";

interface TagItemProps {
  title: string;
  color?: string;
  editable?: boolean;
  onRemove?: () => void;
}

const TagItem: React.FC<TagItemProps> = ({
  title,
  color,
  editable = false,
  onRemove,
}) => {
  return (
    <div
      className={`inline-flex items-center h-[27px] px-3 rounded-[10px] outline outline-1 outline-offset-[-1px] bg-${color}/50 outline-${color}`}
    >
      <span className="text-font text-sm font-normal font-['Inter'] whitespace-nowrap">
        {title}
      </span>
      {editable && (
        <button
          className="ml-2 w-3 h-3 text-font hover:text-red-500"
          onClick={onRemove}
        >
          <IconX />
        </button>
      )}
    </div>
  );
};

export default TagItem;
