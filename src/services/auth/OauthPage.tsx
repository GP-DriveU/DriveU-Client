import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeGoogleCode } from "@/api/Login";
import { useAuthStore } from "@/store/useAuthStore";
import { useSemesterStore } from "@/store/useSemesterStore";
import { useDirectoryStore } from "@/store/useDirectoryStore";
import { useTagStore } from "@/store/useTagStore";

function OAuthCallback() {
  const redirectUri = `${window.location.origin}/oauth/google`;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const code = searchParams.get("code");
    if (!code) {
      navigate("/login");
      return;
    }

    exchangeGoogleCode(code, redirectUri)
      .then((res) => {
        const { user, token, semesters, directories } = res;
        useAuthStore
          .getState()
          .login(user, token.accessToken, token.refreshToken);

        if (!semesters || semesters.length === 0) {
          console.warn(
            "[OAuth] Login success, but no semesters returned from server."
          );

          useSemesterStore.getState().setSemesters([]);

          alert("등록된 학기 정보가 없습니다. 관리자에게 문의해주세요.");

          navigate("/login");
          return;
        }

        const targetSemester =
          semesters.find((s) => s.isCurrent) || semesters[0];

        if (targetSemester) {
          const { year, term } = targetSemester;

          useSemesterStore.getState().setSemesters(semesters);
          useSemesterStore.getState().setSelectedSemester(year, term);
          useDirectoryStore.getState().setDirectoriesFromServer([
            {
              year,
              term,
              directories,
            },
          ]);
        }

        const availableColorKeys = [
          "yellow",
          "green",
          "orange",
          "red",
          "gray",
          "lightblue",
        ];

        const tagItems = directories
          .filter((dir) => dir.name === "학업" || dir.name === "과목")
          .flatMap((dir) =>
            (dir.children ?? []).map((child, index) => ({
              id: child.id,
              title: child.name,
              color: `tag-${
                availableColorKeys[index % availableColorKeys.length]
              }`,
              parentDirectoryId: dir.id,
            }))
          );

        useTagStore.getState().setTags(tagItems);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error("Login Failed:", err);
        navigate("/login");
      });
  }, [navigate, redirectUri, searchParams]);

  return (
    <>
      <div className="bg-white"></div>
    </>
  );
}

export default OAuthCallback;
