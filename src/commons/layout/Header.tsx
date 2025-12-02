import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconChevronDown, IconUser } from "@/assets";
import Button from "@/commons/inputs/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { useSemesterStore } from "@/store/useSemesterStore";

function Header() {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const { selectedSemesterKey, semesters, setSelectedSemester } =
    useSemesterStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSemesterClick = (year: number, term: any) => {
    setSelectedSemester(year, term);
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <header
      className="relative w-full mx-auto p-5 shadow-2xl border-b border-gray_1 bg-background font-sans"
      style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }}
    >
      <div className="flex items-center justify-between">
        <h1
          className="text-primary text-2xl sm:text-3xl font-extrabold cursor-pointer"
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
          <div className="flex gap-4 text-font items-center relative">
            <span className="hidden md:inline text-big-bold font-bold">
              {user.name}
              <span className="font-regular text-big-regular">님</span>
            </span>

            <div className="relative">
              <div
                className="hidden md:flex items-center gap-2 px-3 py-1 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-sm sm:text-base font-semibold select-none">
                  {selectedSemesterKey
                    ? (() => {
                        const [year, term] = selectedSemesterKey.split("-");
                        return `${year}년 ${term === "SPRING" ? "1" : "2"}학기`;
                      })()
                    : "학기 선택"}
                </span>
                <IconChevronDown
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50 flex flex-col py-1">
                  {semesters.map((sem) => (
                    <div
                      key={sem.userSemesterId}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium text-center"
                      onClick={() => handleSemesterClick(sem.year, sem.term)}
                    >
                      {sem.year}년 {sem.term === "SPRING" ? "1" : "2"}학기
                    </div>
                  ))}
                </div>
              )}
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
