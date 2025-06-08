import { useNavigate } from "react-router-dom";
import IconArrowLeft from "../../assets/icon/icon_arrow_left.svg?react";
import TitleSection from "../../commons/section/TitleSection";
import GalleryQuestion from "../../commons/gallery/GalleryQuestion";
import { useEffect, useState } from "react";
import {
  fetchSemesterQuestions,
  type SemesterQuestionSummary,
} from "../../api/Question";
import { useSemesterStore } from "../../store/useSemesterStore";

function QuestionListPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<SemesterQuestionSummary[]>([]);
  const currentSemesterId =
    useSemesterStore().getCurrentSemester()?.userSemesterId ?? 0;

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchSemesterQuestions(currentSemesterId);
        setQuestions(data);
      } catch (error) {
        console.error("문제 조회 실패:", error);
      }
    };

    loadQuestions();
  }, []);

  return (
    <div className="w-full flex bg-white flex-col">
      <div className="w-full pl-10 pt-6">
        <IconArrowLeft onClick={() => navigate(-1)} />
      </div>
      <TitleSection
        title="예상 문제"
        semester="다운로드 버튼을 클릭하여 직접 문제를 해결해보세요!"
      />
      <div className="w-full px-10">
        <GalleryQuestion
          items={questions.map((question) => ({
            id: String(question.questionId),
            version: String(question.version),
            title: question.title,
            date: new Date(question.createdAt).toLocaleDateString(),
          }))}
        />
      </div>
    </div>
  );
}

export default QuestionListPage;
