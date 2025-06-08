import { Routes, Route, useParams } from "react-router-dom";
import HomePage from "../services/home/HomePage";
import LandingPage from "../services/landing/LandingPage";
import { useAuthStore } from "../store/useAuthStore";
import LoginPage from "../services/auth/LoginPage";
import OAuthCallback from "../services/auth/OauthPage";
import AppLayout from "../services/AppLayout";
import NoteDetailPage from "../services/contents/note/NoteDetailPage";
import NoteEditPage from "../services/contents/note/NoteEditPage";
import MyPage from "../services/mypage/MyPage";
import QuestionListPage from "../services/question/QuestionListPage";
import QuestionDetailPage from "../services/question/QuestionDetailPage";
import FilePage from "../services/contents/FilePage";
import FileDetailPage from "../services/contents/FileDetailPage";
import NoteWritePage from "../services/contents/note/NoteWritePage";

function Router() {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  const StudyDetailPage = () => {
    const { slug } = useParams();

    if (slug?.startsWith("강의필기")) {
      return <NoteDetailPage />;
    } else {
      return <FileDetailPage />;
    }
  };

  const StudyEditPage = () => {
    const { slug } = useParams();

    if (slug?.startsWith("강의필기")) {
      return <NoteEditPage />;
    }

    return null;
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
      <Route path="activity">
        <Route
          path=":slug"
          element={
            <AppLayout>
              <FilePage />
            </AppLayout>
          }
        />
        <Route
          path=":slug/:id"
          element={
            <AppLayout>
              <FileDetailPage />
            </AppLayout>
          }
        />
      </Route>

      <Route path="subject">
        <Route
          path=":slug"
          element={
            <AppLayout>
              <FilePage />
            </AppLayout>
          }
        />
        <Route
          path=":slug/:id"
          element={
            <AppLayout>
              <FileDetailPage />
            </AppLayout>
          }
        />
      </Route>

      <Route path="study">
        <Route
          path=":slug"
          element={
            <AppLayout>
              <FilePage />
            </AppLayout>
          }
        />
        <Route
          path=":slug/:id"
          element={
            <AppLayout>
              <StudyDetailPage />
            </AppLayout>
          }
        />
        <Route
          path=":slug/:id/edit"
          element={
            <AppLayout>
              <StudyEditPage />
            </AppLayout>
          }
        />
        <Route
          path=":slug/new"
          element={
            <AppLayout>
              <NoteWritePage />
            </AppLayout>
          }
        />
      </Route>

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
