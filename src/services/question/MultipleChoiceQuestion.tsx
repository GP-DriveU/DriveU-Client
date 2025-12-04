interface MultipleChoiceQuestionProps {
  index: number;
  question: string;
  options: string[];
  userAnswer?: string;
  correctAnswer?: string;
  isSolved: boolean;
  onSelect: (answer: string) => void;
}

const getOptionStyle = (
  option: string,
  isSolved: boolean,
  userAnswer?: string,
  correctAnswer?: string
) => {
  if (isSolved) {
    if (option === correctAnswer) {
      return "bg-green-100 text-green-700 border-green-500";
    }
    if (option === userAnswer) {
      return "bg-red-100 text-red-700 border-red-500";
    }
    return "bg-tag-gray text-black border-transparent";
  }

  if (option === userAnswer) {
    return "bg-tag-lightblue text-primary border-primary";
  }

  return "bg-tag-gray text-black border-transparent";
};

function MultipleChoiceQuestion({
  index,
  question,
  options,
  userAnswer,
  correctAnswer,
  isSolved,
  onSelect,
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
            onClick={() => !isSolved && onSelect(opt)}
            className={`w-full rounded-[10px] px-6 py-4 text-xl font-normal font-pretendard border-2 cursor-pointer transition-colors ${getOptionStyle(
              opt,
              isSolved,
              userAnswer,
              correctAnswer
            )}`}
          >
            {opt}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MultipleChoiceQuestion;
