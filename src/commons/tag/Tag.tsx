import React, { useState, useEffect } from "react";
import TagItem from "./TagItem";
import { type TagData } from "../../types/tag";

interface TagGroupProps {
  tags: TagData[];
  onSave: (updatedTags: TagData[]) => void;
}

const Tag: React.FC<TagGroupProps> = ({ tags, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [localTags, setLocalTags] = useState<TagData[]>([]);

  useEffect(() => {
    const availableColorKeys = [
      "yellow",
      "green",
      "orange",
      "red",
      "gray",
      "lightblue",
    ];

    const colorMap = new Map<number, string>();
    const usedColors = new Set<string>();

    const getColorForId = (id: number) => {
      if (colorMap.has(id)) return colorMap.get(id)!;
      const available = availableColorKeys.filter((c) => !usedColors.has(c));
      const color =
        available.length > 0
          ? available[Math.floor(Math.random() * available.length)]
          : availableColorKeys[
              Math.floor(Math.random() * availableColorKeys.length)
            ];
      colorMap.set(id, color);
      usedColors.add(color);
      return color;
    };

    const assignedTags = tags.map((tag) => ({
      ...tag,
      color: tag.color ?? getColorForId(tag.id),
    }));

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
            key={tag.id ?? index}
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
