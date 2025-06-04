import React from "react";

interface ShortAnswerQuestionProps {
  index: number;
  question: string;
  answer: string;
}

const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  index,
  question,
  answer,
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-primary text-3xl font-bold font-pretendard">
        Question {index + 1}
      </div>
      <div className="text-black text-xl font-normal font-pretendard">
        {question}
      </div>
      <div className="w-full rounded-[10px] px-6 py-4 outline outline-[0.8px] outline-font text-black text-xl font-normal font-pretendard">
        {answer}
      </div>
    </div>
  );
};

export default ShortAnswerQuestion;
