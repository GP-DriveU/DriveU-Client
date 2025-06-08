import { useNavigate } from "react-router-dom";
import IconArrowLeft from "../../assets/icon/icon_arrow_left.svg?react";
import TitleSection from "../../commons/section/TitleSection";
//import GalleryQuestion from "../../commons/gallery/GalleryQuestion";

function QuestionListPage() {
  const navigate = useNavigate();

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
        {/* <GalleryQuestion items={dummyItems} /> */}
      </div>
    </div>
  );
}

export default QuestionListPage;
