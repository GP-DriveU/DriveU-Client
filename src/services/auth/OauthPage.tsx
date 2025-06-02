import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchAndStoreUser } from "../../hooks/auth/useFetchUser";
import { exchangeGoogleCode } from "../../api/Login";

function OAuthCallback() {
  const redirectUri = `${window.location.origin}/oauth/google`;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

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
        setAccessToken(res.token.accessToken);
        setRefreshToken(res.token.refreshToken);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate, redirectUri, searchParams]);

  useEffect(() => {
    if (accessToken && refreshToken) {
      fetchAndStoreUser(accessToken, refreshToken, () => {
        navigate("/", { replace: true });
      });
    }
  }, [accessToken, refreshToken, navigate]);

  return (
    <>
      <div className="bg-white"></div>
    </>
  );
}

export default OAuthCallback;
