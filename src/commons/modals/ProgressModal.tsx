import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animation/loading.json";

interface ProgressModalProps {
  isOpen: boolean;
}

function ProgressModal({ isOpen }: ProgressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm flex flex-col items-center text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-black">AI 요약 생성 중</h2>
          <p className="text-base text-black">잠시만 기다려주세요.</p>
        </div>
        <Lottie
          animationData={loadingAnimation}
          loop
          autoplay
          style={{ width: 360, height: 200 }}
        />
      </div>
    </div>
  );
}

export default ProgressModal;
