import React from "react";

interface IconItem {
  id: string;
  icon: React.ReactNode;
}

interface TitleSectionProps {
  title: string;
  semester?: string;
  items: IconItem[];
  onIconClick?: (id: string) => void;
  selectedId?: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({
  title,
  semester,
  items,
  onIconClick,
  selectedId,
}) => {
  const handleClick = (id: string) => {
    if (onIconClick) {
      onIconClick(id);
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 px-10 pt-12 font-pretendard">
      <div className="flex flex-row items-end gap-3">
        <div className="text-black text-2xl sm:text-3xl font-extrabold">
          {title}
        </div>
        <div className="text-black text-lg sm:text-xl font-normal">
          {semester}
        </div>
      </div>
      <div className="flex justify-start items-center gap-3">
        {items.map(({ id, icon }) => (
          <div
            key={id}
            onClick={() => handleClick(id)}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded ${
              selectedId === id ? "bg-primary text-white" : "text-black"
            }`}
          >
            <div className={selectedId === id ? "fill-white text-white" : ""}>
              {icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TitleSection;
