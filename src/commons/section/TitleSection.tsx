import React from "react";

interface IconItem {
  id: string;
  icon: React.ReactNode;
}

interface TitleSectionProps {
  title: string;
  semester?: string;
  items?: IconItem[];
  onIconClick?: (id: string) => void;
  selectedIds?: string[];
  selectedId?: string;
  isIconDisabled?: boolean;
}

function TitleSection({
  title,
  semester,
  items,
  onIconClick,
  selectedIds,
  selectedId,
  isIconDisabled,
}: TitleSectionProps) {
  const handleClick = (id: string) => {
    if (onIconClick && !isIconDisabled) {
      onIconClick(id);
    }
  };

  const isSelected = (id: string) => {
    if (selectedIds) return selectedIds.includes(id);
    if (selectedId) return selectedId === id;
    return false;
  };

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 px-10 pt-12 pb-6 font-pretendard">
      <div className="flex flex-row items-end gap-3">
        <div className="text-black text-2xl sm:text-3xl font-extrabold">
          {title}
        </div>
        <div className="text-black text-lg sm:text-xl font-normal">
          {semester}
        </div>
      </div>
      {items && items.length > 0 && (
        <div className="flex justify-start items-center gap-3">
          {items.map(({ id, icon }) => {
            const active = isSelected(id);
            return (
              <div
                key={id}
                onClick={() => handleClick(id)}
                className={`relative w-8 h-8 flex items-center justify-center rounded ${
                  active ? "bg-primary text-white" : "text-black"
                } ${
                  isIconDisabled
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer"
                }`}
              >
                <div className={active ? "fill-white text-white" : ""}>
                  {icon}
                </div>

                {active && !isIconDisabled && (
                  <span className="absolute top-[-2px] right-[-2px] w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TitleSection;
