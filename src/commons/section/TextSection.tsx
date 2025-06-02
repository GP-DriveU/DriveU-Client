import React from "react";

interface TextSectionProps {
  title: string;
  rightElement?: React.ReactNode;
}

const TextSection: React.FC<TextSectionProps> = ({ title, rightElement }) => {
  return (
    <div className="flex gap-6 items-center w-full px-10 py-6">
      <div className="text-font text-2xl items-center font-semibold font-pretendard">
        {title}
      </div>
      {rightElement && <div className="flex-grow">{rightElement}</div>}
    </div>
  );
};

export default TextSection;
