import { useNavigate } from "react-router-dom";
import { IconChevronDown, IconUser } from "@/assets";
import Button from "@/commons/inputs/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { useSemesterStore } from "@/store/useSemesterStore";

function Header() {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const { selectedSemesterKey } = useSemesterStore();

  return (
    <header
      className="relative w-full mx-auto p-5 shadow-2xl border-b border-gray_1 bg-background font-sans"
      style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }}
    >
      <div className="flex items-center justify-between">
        <h1
          className="text-primary text-2xl sm:text-3xl font-extrabold"
          onClick={() => navigate("/")}
        >
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
            <span className="hidden md:inline text-big-bold font-bold">
              {user.name}
              <span className="font-regular text-big-regular">님</span>
            </span>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 border rounded">
              <span className="text-sm sm:text-base font-semibold">
                {selectedSemesterKey
                  ? (() => {
                      const [year, term] = selectedSemesterKey.split("-");
                      return `${year}년 ${term === "SPRING" ? "1" : "2"}학기`;
                    })()
                  : ""}
              </span>
              <IconChevronDown />
            </div>
            <IconUser
              className="cursor-pointer"
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
