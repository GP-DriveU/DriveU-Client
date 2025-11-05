import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import Sidebar from "@/commons/layout/sidebar/SideBar";
import ScrollToTop from "@/commons/layout/ScrollToTop";
import DesktopOnlyPage from "@/services/error/desktop/DesktopOnlyPage";

interface AppLayoutProps {
  children: React.ReactNode;
}

const MOBILE_BREAKPOINT = 768;

function AppLayout ({ children }: AppLayoutProps) {

  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );
 
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <DesktopOnlyPage />;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <ScrollToTop />
        {children}
      </div>
    </div>
  );
}

export default AppLayout;
