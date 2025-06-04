import React from "react";
import Sidebar from "../commons/layout/sidebar/SideBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default AppLayout;
