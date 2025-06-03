import React, { useState, useEffect } from "react";
import TagItem from "./TagItem";

interface Tag {
  title: string;
  color: string;
}

interface TagGroupProps {
  tags: Tag[];
  onSave: (updatedTags: Tag[]) => void;
}

const Tag: React.FC<TagGroupProps> = ({ tags, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [localTags, setLocalTags] = useState<Tag[]>([]);

  useEffect(() => {
    const availableColorKeys = [
      "yellow",
      "green",
      "orange",
      "red",
      "gray",
      "lightblue",
    ];

    const getRandomColor = (usedColors: string[]) => {
      const filtered = availableColorKeys.filter((c) => !usedColors.includes(c));
      const pool = filtered.length > 0 ? filtered : availableColorKeys;
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const usedColors: string[] = [];
    const assignedTags = tags.map((tag) => {
      const color = tag.color || getRandomColor(usedColors);
      usedColors.push(color);
      return { ...tag, color };
    });

    setLocalTags(assignedTags);
  }, [tags]);

  const handleRemove = (index: number) => {
    setLocalTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(localTags);
    setEditMode(false);
  };

  return (
    <div className="w-full flex flex-row justify-between items-center">
      <div className="flex flex-wrap gap-2 items-center">
        {localTags.map((tag, index) => (
          <TagItem
            key={index}
            title={tag.title}
            color={tag.color}
            editable={editMode}
            onRemove={() => handleRemove(index)}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <div
          className="w-[138px] h-7 text-right justify-center text-tag-lightblue text-xl font-normal font-['Pretendard'] cursor-pointer"
          onClick={() => {
            if (editMode) {
              handleSave();
            } else {
              setEditMode(true);
            }
          }}
        >
          {editMode ? "수정 완료" : "태그 수정하기"}
        </div>
      </div>
    </div>
  );
};

export default Tag;
