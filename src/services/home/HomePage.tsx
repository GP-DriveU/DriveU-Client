import Sidebar from "../../commons/layout/sidebar/SideBar";
import { useEffect } from "react";
import { useDirectoryStore } from "../../store/useDirectoryStore";

function HomePage() {
  const { setSemesterDirectories, setSelectedSemester } = useDirectoryStore();

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

    setSemesterDirectories("2024-1", dummyData);
    setSelectedSemester("2024-1");
  }, [setSemesterDirectories, setSelectedSemester]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div>this is homepage</div>
      </div>
    </div>
  );
}

export default HomePage;
