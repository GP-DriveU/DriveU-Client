import React from "react";

interface TabBarItemProps {
  title: string;
  colorClass: string; // tailwind bg color class like "bg-primary"
  selectedColorClass: string; // tailwind bg color class when selected
  selected: boolean;
  onClick?: () => void;
}

const TabBarItem: React.FC<TabBarItemProps> = ({
  title,
  colorClass,
  selectedColorClass,
  selected,
  onClick,
}) => {
  return (
    <div
      className={`w-32 relative cursor-pointer ${
        selected ? "-mt-2" : "mt-0"
      } transition-all duration-300 ease-in-out`}
      style={{ height: selected ? "70px" : "50px" }}
      onClick={onClick}
    >
      <div
        className={`w-32 absolute left-0 rounded-tl-[20px] rounded-tr-[20px] transition-all duration-300 ease-in-out ${
          selected ? selectedColorClass : colorClass
        }`}
        style={{ height: selected ? "70px" : "50px" }}
      />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <span className="text-white text-2xl font-semibold font-pretendard">
          {title}
        </span>
      </div>
    </div>
  );
};

export default TabBarItem;
