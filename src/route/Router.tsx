import { Routes, Route } from "react-router-dom";
import HomePage from "../services/home/HomePage";
import LandingPage from "../services/landing/LandingPage";
import { useAuthStore } from "../store/useAuthStore";
import LoginPage from "../services/auth/LoginPage";
import NotePage from "../services/note/NotePage";
import OAuthCallback from "../services/auth/OauthPage";
import AppLayout from "../services/AppLayout";
import NoteDetailPage from "../services/note/NoteDetailPage";
import NoteEditPage from "../services/note/NoteEditPage";
import MyPage from "../services/mypage/MyPage";

function Router() {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <AppLayout>
              <HomePage />
            </AppLayout>
          ) : (
            <LandingPage />
          )
        }
      />
      <Route path="/oauth/google" element={<OAuthCallback />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/study/강의필기"
        element={
          <AppLayout>
            <NotePage />
          </AppLayout>
        }
      />
      <Route
        path="/study/강의필기/:id"
        element={
          <AppLayout>
            <NoteDetailPage />
          </AppLayout>
        }
      />
      <Route
        path="/study/강의필기/:id/edit"
        element={
          <AppLayout>
            <NoteEditPage />
          </AppLayout>
        }
      />
      <Route
        path="/mypage"
        element={
          <AppLayout>
            <MyPage />
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default Router;
