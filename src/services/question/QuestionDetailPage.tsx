import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchQuestionDetail,
  submitQuestionResults,
  type QuestionItem,
  type QuestionResultItem,
} from "@/api/Question";
import TextSection from "@/commons/section/TextSection";
import TitleSection from "@/commons/section/TitleSection";
import MultipleChoiceQuestion from "@/services/question/MultipleChoiceQuestion";
import ShortAnswerQuestion from "@/services/question/ShortAnswerQuestion";
import Button from "@/commons/inputs/Button";
import { IconArrowLeft } from "@/assets";

function QuestionDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("");
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  const [isSolved, setIsSolved] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<QuestionResultItem[]>([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;

    try {
      const data = await fetchQuestionDetail(Number(id));
      setTitle(data.title);
      setVersion(`ver.${data.version}`);
      setQuestions(data.questions);
      setIsSolved(data.isSolved);

      if (data.isSolved && data.results) {
        setResults(data.results);
        const initialAnswers: { [key: number]: string } = {};
        data.results.forEach((r) => {
          initialAnswers[r.questionIndex] = r.userAnswer;
        });
        setUserAnswers(initialAnswers);
      } else {
        setUserAnswers({});
        setResults([]);
      }
    } catch (error) {
      console.error("Failed to fetch question detail:", error);
    }
  };

  const handleAnswerChange = (index: number, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [index]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!id) return;

    if (Object.keys(userAnswers).length < questions.length) {
      const confirmSubmit = window.confirm(
        "풀지 않은 문제가 있습니다. 제출하시겠습니까?"
      );
      if (!confirmSubmit) return;
    }

    try {
      const submissions = Object.keys(userAnswers).map((idx) => ({
        questionIndex: Number(idx),
        userAnswer: userAnswers[Number(idx)],
      }));

      const response = await submitQuestionResults(Number(id), { submissions });

      setResults(response.results);
      setIsSolved(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("제출 실패:", error);
      alert("답안 제출 중 오류가 발생했습니다.");
    }
  };

  const handleRetry = () => {
    if (
      window.confirm("다시 풀면 기존 기록은 초기화됩니다. 진행하시겠습니까?")
    ) {
      setIsSolved(false);
      setUserAnswers({});
      setResults([]);
      window.scrollTo(0, 0);
    }
  };

  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalCount = questions.length;

  return (
    <div className="w-full flex bg-white flex-col mb-16 pb-20">
      <div className="w-full pl-10 pt-6">
        <IconArrowLeft
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        />
      </div>

      <TitleSection title={title} />
      <TextSection
        title="버전"
        rightElement={
          <div className="flex items-center gap-4">
            <span className="text-font text-md">{version}</span>
          </div>
        }
      />

      {isSolved && totalCount > 0 && (
        <div className="flex items-center gap-1 px-10 pb-4">
          <span className="text-red-600 font-extrabold text-xl">
            {correctCount}
          </span>
          <span className="text-gray-400 text-lg mx-0.5">/</span>
          <span className="text-gray-600 font-bold text-lg">{totalCount}</span>
          <span className="ml-1 text-md text-red-500 font-bold">정답</span>
        </div>
      )}

      <div className="flex flex-col gap-16 px-10 py-4">
        {questions.map((q, index) => {
          const result = results.find((r) => r.questionIndex === index);

          return (
            <div key={index} className="text-base text-font">
              {q.type === "multiple_choice" ? (
                <MultipleChoiceQuestion
                  index={index}
                  question={q.question}
                  options={q.options || []}
                  userAnswer={userAnswers[index]}
                  correctAnswer={result?.correctAnswer}
                  isSolved={isSolved}
                  onSelect={(ans) => handleAnswerChange(index, ans)}
                />
              ) : (
                <ShortAnswerQuestion
                  index={index}
                  question={q.question}
                  userAnswer={userAnswers[index]}
                  correctAnswer={result?.correctAnswer}
                  isSolved={isSolved}
                  onChange={(ans) => handleAnswerChange(index, ans)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="w-full flex justify-center pt-24">
        <div className="w-48">
          {isSolved ? (
            <Button size="medium" color="primary" onClick={handleRetry}>
              다시 풀기
            </Button>
          ) : (
            <Button size="medium" color="primary" onClick={handleSubmit}>
              제출하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionDetailPage;
