interface MultipleChoiceQuestionProps {
  index: number;
  question: string;
  options: string[];
  answer: string;
}

function MultipleChoiceQuestion ({
  index,
  question,
  options,
  answer,
}: MultipleChoiceQuestionProps) {

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-primary text-3xl font-bold font-pretendard">
        Question {index + 1}
      </div>
      <div className="text-black text-xl font-normal font-pretendard">
        {question}
      </div>
      <div className="flex flex-col gap-6">
        {options.map((opt, i) => (
          <div
            key={i}
            className={`w-full rounded-[10px] px-6 py-4 ${
              opt === answer
                ? "bg-tag-lightblue text-primary"
                : "bg-tag-gray text-black"
            } text-xl font-normal font-pretendard`}
          >
            {opt}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
