import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import IconArrowLeft from "../../assets/icon/icon_arrow_left.svg?react";
import TextSection from "../../commons/section/TextSection";
import TitleSection from "../../commons/section/TitleSection";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import ShortAnswerQuestion from "./ShortAnswerQuestion";

function QuestionDetailPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("");
  const [date, setDate] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with real API call
    const fetchedData = {
      title: "객체지향프로그래밍 1주차 예상 문제",
      version: "ver.1",
      date: "2025.06.04",
      questions: [
        {
          type: "multiple_choice",
          question: "KUCloud의 주요 기능은 무엇인가요?",
          options: [
            "사진 편집",
            "필기 요약과 문제 생성",
            "이메일 전송",
            "시간표 작성",
          ],
          answer: "필기 요약과 문제 생성",
        },
        {
          type: "multiple_choice",
          question: "KUCloud는 어떤 모델을 기반으로 동작하나요?",
          options: ["BERT", "GPT-4", "T5", "CNN"],
          answer: "GPT-4",
        },
        {
          type: "short_answer",
          question: "KUCloud에서 사용자는 어떤 구조로 자료를 정리할 수 있나요?",
          answer: "학기별 디렉토리 구조",
        },
      ],
    };

    setTitle(fetchedData.title);
    setVersion(fetchedData.version);
    setDate(fetchedData.date);
    setQuestions(fetchedData.questions);
  }, []);

  return (
    <div className="w-full flex bg-white flex-col mb-16">
      <div className="w-full pl-10 pt-6">
        <IconArrowLeft onClick={() => navigate(-1)} />
      </div>
      <TitleSection title={title} />
      <TextSection
        title="버전"
        rightElement={<p className="flex h-full items-center">{version}</p>}
      />
      <TextSection
        title="날짜"
        rightElement={<p className="flex h-full items-center">{date}</p>}
      />
      <div className="flex flex-col gap-16 px-10 py-4">
        {questions.map((q, index) => (
          <div key={index} className="text-base text-font">
            {q.type === "multiple_choice" ? (
              <MultipleChoiceQuestion
                index={index}
                question={q.question}
                options={q.options}
                answer={q.answer}
              />
            ) : (
              <ShortAnswerQuestion
                index={index}
                question={q.question}
                answer={q.answer}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionDetailPage;
