import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeGoogleCode } from "../../api/Login";
import { useAuthStore } from "../../store/useAuthStore";
import { useSemesterStore } from "../../store/useSemesterStore";
import { useDirectoryStore } from "../../store/useDirectoryStore";

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
