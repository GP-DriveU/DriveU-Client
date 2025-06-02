import { useEffect } from "react";
import { useDirectoryStore } from "../store/useDirectoryStore";
import React from "react";
import Sidebar from "../commons/layout/sidebar/SideBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { setSemesterDirectories, setSelectedSemester } = useDirectoryStore();

  const selectedSemester = useDirectoryStore((state) => state.selectedSemester);
  const semesterDirectories = useDirectoryStore(
    (state) => state.semesterDirectories
  );
  const shouldInit =
    !selectedSemester || !semesterDirectories[selectedSemester];

  useEffect(() => {
    const dummyData = [
      {
        id: 100,
        name: "학업",
        is_default: true,
        order: 1,
        children: [
          {
            id: 101,
            name: "강의필기",
            is_default: true,
            order: 1,
            children: [],
          },
          { id: 102, name: "과제", is_default: true, order: 2, children: [] },
          {
            id: 103,
            name: "프로젝트",
            is_default: true,
            order: 2,
            children: [],
          },
        ],
      },
      {
        id: 200,
        name: "수업",
        is_default: true,
        order: 2,
        children: [
          {
            id: 201,
            name: "객지론",
            is_default: false,
            order: 1,
            children: [],
          },
          {
            id: 202,
            name: "자료구조",
            is_default: false,
            order: 1,
            children: [],
          },
          {
            id: 203,
            name: "분산시",
            is_default: false,
            order: 1,
            children: [],
          },
        ],
      },
      {
        id: 300,
        name: "대외활동",
        is_default: true,
        order: 3,
        children: [
          { id: 301, name: "동아리", is_default: true, order: 1, children: [] },
          {
            id: 302,
            name: "공모전",
            is_default: true,
            order: 2,
            children: [
              {
                id: 310,
                name: "머시기 공모전",
                is_default: false,
                order: 1,
                children: [],
              },
            ],
          },
        ],
      },
    ];

    if (shouldInit) {
      setSemesterDirectories("2024-1", dummyData);
      setSelectedSemester("2024-1");
    }
  }, [shouldInit]);

  if (!selectedSemester || !semesterDirectories[selectedSemester]) return null;

  return (
    <div className="flex bg-white">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default AppLayout;
