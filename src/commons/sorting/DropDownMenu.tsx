import { IconCheck } from "@/assets";

interface DropdownMenuProps {
  options: Record<string, string>;
  onSelect: (key: string) => void;
  selectedValue: string;
}

function DropdownMenu ({
  options,
  onSelect,
  selectedValue,
}: DropdownMenuProps) {
  return (
    <div className="p-4 bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] rounded-lg flex flex-col gap-4">
      {Object.entries(options).map(([key, value]) => (
        <div
          key={key}
          onClick={() => onSelect(key)}
          className="w-full flex justify-between items-center cursor-pointer text-black hover:font-semibold gap-4"
        >
          <span>{value}</span>
          {selectedValue === key && <IconCheck className="w-4 h-4" />}
        </div>
      ))}
    </div>
  );
}

export default DropdownMenu;
