import Button from "../inputs/Button";
import { useAuthStore } from "../../store/useAuthStore";
import UserIcon from "../../assets/icon/icon_user.svg?react";
import ChevronDownIcon from "../../assets/icon/icon_chevron_down.svg?react";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  return (
    <header
      className="relative w-full mx-auto p-5 shadow-2xl border-b border-gray_1 bg-background font-sans"
      style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-primary text-2xl sm:text-3xl font-extrabold">
          DriveU
        </h1>

        {!isLoggedIn ? (
          <div className="flex min-w-[150px] gap-4">
            <Button
              size="medium"
              color="primary"
              onClick={() => {
                navigate("/login");
              }}
            >
              로그인
            </Button>
          </div>
        ) : (
          <div className="flex gap-4 text-font items-center">
            <span className="text-big-bold font-bold">
              {user.name}
              <span className="font-regular text-big-regular">님</span>
            </span>
            <div className="flex items-center gap-2 px-3 py-1 border rounded">
              <span className="text-sm sm:text-base font-semibold">
                25년 1학기
              </span>
              <ChevronDownIcon />
            </div>
            <UserIcon
              onClick={() => {
                navigate("/mypage");
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
