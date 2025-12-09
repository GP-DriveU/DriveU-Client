import { IconArrowDropDown, IconArrowDropUp } from "@/assets";
import DropdownMenu from "@/commons/sorting/DropDownMenu";

interface SortMenuButtonProps {
  label: string;
  isOpen: boolean;
  onClick: () => void;
  options: Record<string, string>;
  onSelect: (value: string) => void;
  selectedValue: string;
}

function SortMenuButton({
  label,
  isOpen,
  onClick,
  options,
  onSelect,
  selectedValue,
}: SortMenuButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="pl-4 pr-2 py-2 rounded outline outline-[0.50px] outline-tag-gray flex justify-between items-center gap-4"
      >
        <span className="text-center text-font text-base font-normal">
          {label}
        </span>
        {isOpen ? (
          <IconArrowDropUp className="w-6 h-6 text-font" />
        ) : (
          <IconArrowDropDown className="w-6 h-6 text-font" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-10 min-w-32">
          <DropdownMenu
            options={options}
            onSelect={onSelect}
            selectedValue={selectedValue}
          />
        </div>
      )}
    </div>
  );
}

export default SortMenuButton;
