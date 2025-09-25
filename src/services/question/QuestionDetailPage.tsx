import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchQuestionDetail } from "@/api/Question";
import TextSection from "@/commons/section/TextSection";
import TitleSection from "@/commons/section/TitleSection";
import MultipleChoiceQuestion from "@/services/question/MultipleChoiceQuestion";
import ShortAnswerQuestion from "@/services/question//ShortAnswerQuestion";
import { IconArrowLeft } from "@/assets";

function QuestionDetailPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const data = await fetchQuestionDetail(Number(id));
        setTitle(data.title);
        setVersion(`ver.${data.version}`);
        setQuestions(data.questions);
      } catch (error) {
        console.error("Failed to fetch question detail:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex bg-white flex-col mb-16">
      <div className="w-full pl-10 pt-6">
        <IconArrowLeft onClick={() => navigate(-1)} />
      </div>
      <TitleSection title={title} />
      <TextSection title="버전" rightElement={<>{version}</>} />
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
