import { Routes, Route, useParams } from "react-router-dom";
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
import QuestionListPage from "../services/question/QuestionListPage";
import QuestionDetailPage from "../services/question/QuestionDetailPage";
import FilePage from "../services/file/FilePage";

function Router() {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  const StudySlugPage = () => {
    const { slug } = useParams();
    return slug?.includes("강의필기") ? <NotePage /> : <FilePage />;
  };

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
        path="/activity/:slug"
        element={
          <AppLayout>
            <FilePage />
          </AppLayout>
        }
      />
      <Route
        path="/subject/:slug"
        element={
          <AppLayout>
            <FilePage />
          </AppLayout>
        }
      />
      <Route
        path="/study/:slug"
        element={
          <AppLayout>
            <StudySlugPage />
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
      <Route
        path="/question"
        element={
          <AppLayout>
            <QuestionListPage />
          </AppLayout>
        }
      />
      <Route
        path="/question/:id"
        element={
          <AppLayout>
            <QuestionDetailPage />
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default Router;
