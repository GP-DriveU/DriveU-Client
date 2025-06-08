﻿import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeGoogleCode } from "../../api/Login";
import { useAuthStore } from "../../store/useAuthStore";
import { useSemesterStore } from "../../store/useSemesterStore";
import { useDirectoryStore } from "../../store/useDirectoryStore";
import { useTagStore } from "../../store/useTagStore";

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

        const { year, term } = semesters[0];
        useSemesterStore.getState().setSelectedSemester(year, term);
        useDirectoryStore.getState().setSelectedSemester(year, term);
        useSemesterStore.getState().setSemesters(semesters);
        useDirectoryStore.getState().setDirectoriesFromServer([
          {
            year,
            term,
            directories,
          },
        ]);
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
          .flatMap((dir) => dir.children ?? [])
          .map((child, index) => ({
            id: child.id,
            title: child.name,
            color: `tag-${
              availableColorKeys[index % availableColorKeys.length]
            }`,
          }));
        useTagStore.getState().setTags(tagItems);
        navigate("/", { replace: true });
      })
      .catch(() => {
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
