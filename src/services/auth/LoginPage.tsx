import LoginSection from "@/services/auth/LoginSection";

function LoginPage() {
  return (
    <>
      <div className="relative w-full min-h-[550px] flex-col justify-center items-center">
        <LoginSection />
      </div>
    </>
  );
}

export default LoginPage;
