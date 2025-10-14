import Button from "@/commons/inputs/Button";
import LandingSection from "@/services/landing/LadingSection";
import landingImage1 from "@/assets/image/image_landing_1.webp";
import landingImage2 from "@/assets/image/image_landing_2.webp";
import landingImage3 from "@/assets/image/image_landing_3.webp";

function LandingPage() {
  return (
    <div className="space-y-20 font-sans">
      <LandingSection
        image={landingImage1}
        alt="DriveU 클라우드 서비스 메인 화면"
        width={512}
        height={512}
        loading="eager"
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
        image={landingImage2}
        alt="노트북과 모바일 기기에서 클라우드 자료를 확인하는 모습"
        width={512}
        height={512}
        loading="lazy"
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
        image={landingImage3}
        alt="AI가 문서를 요약하고 문제를 생성하는 기능 시연"
        width={512}
        height={512}
        loading="lazy"
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
