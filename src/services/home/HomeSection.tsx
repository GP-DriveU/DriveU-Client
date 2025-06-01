import { useNavigate } from "react-router-dom";
import Button from "../../commons/inputs/Button";

function HomeSection() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center gap-10 my-16">
      <div className="flex flex-row text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#223a58] font-pretendard">
          DriveU
        </h1>
        <p className="text-lg md:text-2xl text-font font-normal font-pretendard mt-2">
          에 오신 것을 환영합니다.
        </p>
      </div>
      <div className="min-w-[450px] gap-10 h-14 flex flex-row">
        {/* todo: 업로드 버튼 어떻게 할지 고민 */}
        <Button
          size="medium"
          color="primary"
          onClick={() => {
            navigate("/");
          }}
        >
          파일 업로드
        </Button>
        <Button
          size="medium"
          color="secondary"
          onClick={() => {
            navigate("/note");
          }}
        >
          AI 문제 만들기
        </Button>
      </div>
    </div>
  );
}

export default HomeSection;
