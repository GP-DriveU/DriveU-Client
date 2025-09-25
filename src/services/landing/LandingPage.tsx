import Button from "@/commons/inputs/Button";
import { LandingImg_1, LandingImg_2, LandingImg_3 } from "@/assets";
import LandingSection from "@/services/landing/LadingSection";

function LandingPage() {
  return (
    <div className="space-y-20 font-sans">
      <LandingSection
        image={<LandingImg_1 />}
        title="DriveU"
        description={
          <>
            <p className="text-primary text-3xl font-extrabold">
              편안한 학교 생활의 출발점,
            </p>
            <p className="text-font text-xl font-normal">
              학부 전용 클라우드 서비스
            </p>
          </>
        }
        button={
          <Button size="medium" color="primary" onClick={() => {}}>
            사용하러 가기
          </Button>
        }
        align="center"
        imageLeft={false}
      />

      <LandingSection
        image={<LandingImg_2 />}
        title={
          <>
            어디서든 안전하게, <br />
            필요한 순간 빠르게.
          </>
        }
        description={
          <>
            클라우드 기반으로 자료를 저장하고 <br />
            언제든 꺼내보세요.
          </>
        }
        align="right"
        imageLeft={true}
      />

      <LandingSection
        image={<LandingImg_3 />}
        title={
          <>
            AI가 요약하고, <br />
            문제도 만들어줘요.
          </>
        }
        description={
          <>
            복잡한 정리는 AI에게 맡기고, <br />
            학습에만 집중하세요.
          </>
        }
        align="left"
        imageLeft={false}
      />
    </div>
  );
}

export default LandingPage;
