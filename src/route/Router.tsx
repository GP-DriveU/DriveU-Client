import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../services/home/HomePage";
import LandingPage from "../services/landing/LandingPage";
import { useAuthStore } from "../store/useAuthStore";

function Router() {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={!isLoggedIn ? <HomePage /> : <LandingPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
