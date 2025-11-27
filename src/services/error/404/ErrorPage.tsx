import Button from "@/commons/inputs/Button";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-white p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-4 break-keep">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-lg text-font break-keep mb-8">
          요청하신 페이지가 존재하지 않거나, 주소가 잘못되었습니다.
          <br />
          입력하신 주소를 다시 확인해주세요.
        </p>

        <div className="flex justify-center">
          <div className="w-40">
            <Button color="primary" size="medium" onClick={() => navigate("/")}>
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
