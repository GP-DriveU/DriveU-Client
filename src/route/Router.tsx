import { Routes, Route } from "react-router-dom";
import HomePage from "../services/home/HomePage";
import LandingPage from "../services/landing/LandingPage";
import { useAuthStore } from "../store/useAuthStore";
import LoginPage from "../services/auth/LoginPage";

function Router() {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <HomePage /> : <LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default Router;
