import { useNavigate } from "react-router-dom";
import IconArrowLeft from "../../assets/icon/icon_arrow_left.svg?react";
import TitleSection from "../../commons/section/TitleSection";
import GalleryQuestion from "../../commons/gallery/GalleryQuestion";

function QuestionListPage() {
  const navigate = useNavigate();

  const dummyItems = [
    {
      id: "1",
      version: "ver.1",
      title: "객체지향프로그래밍 1주차 예상 문제",
      tag: { id: 1, title: "객지프", color: "yellow" },
      date: "2025.06.03",
    },
    {
      id: "2",
      version: "ver.1",
      title: "자료구조 2주차 예상 문제",
      tag: { id: 2, title: "자료구조", color: "green" },
      date: "2025.06.04",
    },
    {
      id: "3",
      version: "ver.1",
      title: "운영체제 3주차 예상 문제",
      tag: { id: 3, title: "운영체제", color: "red" },
      date: "2025.06.05",
    },
    {
      id: "4",
      version: "ver.1",
      title: "컴퓨터구조 4주차 예상 문제",
      tag: { id: 4, title: "컴구", color: "orange" },
      date: "2025.06.06",
    },
  ];

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
        <GalleryQuestion items={dummyItems} />
      </div>
    </div>
  );
}

export default QuestionListPage;
