import React from "react";
import GalleryQuestionItem from "./GalleryQuestionItem";
import { type TagData } from "../../types/tag";
import { useNavigate } from "react-router-dom";

export interface GalleryQuestionItemProps {
  id: string;
  version: string;
  title: string;
  tag: TagData;
  date: string;
}

interface GalleryQuestionGridProps {
  items: GalleryQuestionItemProps[];
}

const GalleryQuestion: React.FC<GalleryQuestionGridProps> = ({ items }) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
      {items && items.length > 0 ? (
        items.map((item, idx) => (
          <GalleryQuestionItem
            key={idx}
            id={item.id}
            version={item.version}
            title={item.title}
            tag={item.tag}
            date={item.date}
            onClick={() => navigate(`/question/${item.id}`)}
          />
        ))
      ) : (
        <div className="col-span-full w-full flex justify-center items-center py-3">
          <p className="text-gray-500 text-base">
            현재 저장된 파일이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default GalleryQuestion;
