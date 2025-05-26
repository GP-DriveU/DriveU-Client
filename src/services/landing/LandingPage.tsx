import LandingImg_1 from "../../assets/image/image_landing_1.svg?react";
import LandingImg_2 from "../../assets/image/image_landing_2.svg?react";
import LandingImg_3 from "../../assets/image/image_landing_3.svg?react";
import Button from "../../commons/inputs/Button";

function LandingPage() {
  return (
    <div className="space-y-20 py-10 px-6 lg:px-20 bg-background font-sans">
      <section className="max-w-screen-xl mx-auto pl-12 flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        <div className="flex flex-col gap-10">
          <div className="text-center space-y-3">
            <h1 className="text-primary text-5xl font-extrabold">DriveU</h1>
            <p className="text-primary text-3xl font-extrabold">
              편안한 학교 생활의 출발점,
            </p>
            <p className="text-font text-xl font-normal">
              학부 전용 클라우드 서비스
            </p>
          </div>
          <div className="w-[250px] mx-auto">
            <Button size="medium" color="primary" onClick={() => {}}>
              사용하러 가기
            </Button>
          </div>
        </div>
        <LandingImg_1 />
      </section>

      <section className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        <LandingImg_2 />
        <div className="w-full max-w-lg space-y-4 text-center lg:text-right">
          <h2 className="text-primary text-5xl font-extrabold">
            어디서든 안전하게, <br />
            필요한 순간 빠르게.
          </h2>
          <p className="text-font text-3xl font-normal">
            클라우드 기반으로 자료를 저장하고 <br />
            언제든 꺼내보세요.
          </p>
        </div>
      </section>

      <section className="max-w-screen-xl mx-auto flex flex-col lg:flex-row-reverse items-center justify-between gap-10">
        <LandingImg_3 />
        <div className="w-full max-w-lg space-y-4 text-center lg:text-left">
          <h2 className="text-primary text-5xl font-extrabold">
            AI가 요약하고, <br />
            문제도 만들어줘요.
          </h2>
          <p className="text-font text-3xl font-normal">
            복잡한 정리는 AI에게 맡기고, <br />
            학습에만 집중하세요.
          </p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
