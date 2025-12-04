interface ShortAnswerQuestionProps {
  index: number;
  question: string;
  userAnswer?: string;
  correctAnswer?: string;
  isSolved: boolean;
  onChange: (answer: string) => void;
}

function ShortAnswerQuestion({
  index,
  question,
  userAnswer = "",
  correctAnswer,
  isSolved,
  onChange,
}: ShortAnswerQuestionProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-primary text-3xl font-bold font-pretendard">
        Question {index + 1}
      </div>
      <div className="text-black text-xl font-normal font-pretendard">
        {question}
      </div>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => onChange(e.target.value)}
        disabled={isSolved}
        placeholder="정답을 입력하세요."
        className={`w-full px-6 py-4 outline outline-[0.8px] text-xl font-normal font-pretendard 
          ${
            isSolved
              ? userAnswer === correctAnswer
                ? "outline-green-500 bg-green-50 text-green-700"
                : "outline-red-500 bg-red-50 text-red-700"
              : "outline-font text-black focus:outline-primary"
          }`}
      />

      {isSolved && userAnswer !== correctAnswer && (
        <div className="mt-2 text-green-600 font-semibold">
          정답: {correctAnswer}
        </div>
      )}
    </div>
  );
}

export default ShortAnswerQuestion;
