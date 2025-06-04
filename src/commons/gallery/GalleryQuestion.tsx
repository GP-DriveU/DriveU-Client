import React from "react";
import GalleryQuestionItem from "./GalleryQuestionItem";
import type Tag from "../tag/Tag";
import { useNavigate } from "react-router-dom";

export interface GalleryQuestionItemProps {
  id: string;
  version: string;
  title: string;
  tag: Tag;
  date: string;
}

interface GalleryQuestionGridProps {
  items: GalleryQuestionItemProps[];
}

const GalleryQuestion: React.FC<GalleryQuestionGridProps> = ({ items }) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
      {items.map((item, idx) => (
        <GalleryQuestionItem
          key={idx}
          id={item.id}
          version={item.version}
          title={item.title}
          tag={item.tag}
          date={item.date}
          onClick={() => navigate(`/question/${item.id}`)}
        />
      ))}
    </div>
  );
};

export default GalleryQuestion;
