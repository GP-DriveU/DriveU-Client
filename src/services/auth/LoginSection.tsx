import { startGoogleLogin } from "../../api/Login";
import OauthIcon from "../../assets/icon/icon_google.svg?react";

function LoginSection() {
  const handleGoogleLogin = () => {
    const redirectUri = `${window.location.origin}/oauth/google`;
    window.location.href = startGoogleLogin(redirectUri);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-108 h-72 p-5 rounded-[10px] outline outline-[0.50px] outline-offset-[-0.50px] outline-font inline-flex flex-col justify-center items-center gap-16">
        <div className="self-stretch text-center justify-center text-primary text-3xl font-extrabold font-['Pretendard']">
          Login
        </div>
        <OauthIcon onClick={handleGoogleLogin} />
      </div>
    </div>
  );
}

export default LoginSection;
