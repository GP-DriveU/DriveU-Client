import { IconMenu, IconQuestion } from "@/assets";
import React from "react";


interface GalleryQuestionItemProps {
  id: string;
  version: string;
  title: string;
  date: string;
  onClick?: () => void;
}

const GalleryQuestionItem: React.FC<GalleryQuestionItemProps> = ({
  id,
  version,
  title,
  date,
  onClick,
}) => {
  return (
    <div
      key={id}
      className="w-full p-4 bg-[#FFFFFF] text-pretendard rounded-lg flex flex-col justify-between gap-y-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <IconQuestion />
            <span className="text-xs text-font font-normal">ver.{version}</span>
          </div>
          <h2 className="text-lg text-black font-semibold">{title}</h2>
        </div>
        <div className="w-5 h-5 flex items-center justify-center">
          <IconMenu />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-pretendard">{date}</span>
      </div>
    </div>
  );
};

export default GalleryQuestionItem;
