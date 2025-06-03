import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import TitleSection from "../../commons/section/TitleSection";
import MyPageSection from "./MyPageSection";
import EditSemester from "./EditSemester";
import AlertModal from "../../commons/modals/AlertModal";

const formatSemester = (s: { year: number; term: string }) =>
  `${String(s.year).slice(2)}년 ${s.term === "SPRING" ? "1학기" : "2학기"}`;

function MyPage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name ?? "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [isEditingSemester, setIsEditingSemester] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [semesterData, setSemesterData] = useState([
    { userSemesterId: 1, year: 2025, term: "SPRING", current: true },
    { userSemesterId: 2, year: 2024, term: "FALL", current: false },
    { userSemesterId: 3, year: 2023, term: "SPRING", current: false },
  ]);

  const deleteSemester = (semesterLabel: string) => {
    const filtered = semesterData.filter(
      (s) => formatSemester(s).trim() !== semesterLabel.trim()
    );
    setSemesterData(filtered);
  };

  const toggleSemesterEdit = () => setIsEditingSemester((prev) => !prev);

  const handleEditClick = () => {
    if (isEditingName) {
      setName(editedName);
    }
    setIsEditingName(!isEditingName);
  };

  return (
    <div className="w-full flex bg-white flex-col">
      <TitleSection title="마이페이지" semester="" />

      <div className="flex flex-col w-full px-6">
        <MyPageSection
          label="이름"
          value={user?.name ?? ""}
          isEditing={isEditingName}
          editValue={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onEdit={handleEditClick}
        />

        <MyPageSection
          label="학기"
          value={formatSemester(
            semesterData.find((s) => s.current) ?? { year: 0, term: "SPRING" }
          )}
          isEditing={isEditingSemester}
          showEditButton={!isEditingSemester}
          editElement={
            <>
              <div className="w-full h-full">
                <EditSemester
                  semesters={semesterData.map(formatSemester)}
                  onRequestDelete={(semester) => setDeleteTarget(semester)}
                  setSemesters={(updatedArray) =>
                    setSemesterData(
                      semesterData.filter((s) =>
                        (updatedArray as string[])
                          .map((u) => u.trim())
                          .includes(formatSemester(s).trim())
                      )
                    )
                  }
                  onEditComplete={() => setIsEditingSemester(false)}
                />
              </div>
              {deleteTarget && (
                <AlertModal
                  title="학기를 삭제하시겠습니까?"
                  description="학기를 삭제하면<br/>해당 학기의 모든 파일 및 내용이 휴지통으로 이동합니다."
                  onConfirm={() => {
                    deleteSemester(deleteTarget);
                    setDeleteTarget(null);
                  }}
                  onCancel={() => setDeleteTarget(null)}
                  isDanger
                />
              )}
            </>
          }
          onEdit={toggleSemesterEdit}
        />
      </div>
    </div>
  );
}

export default MyPage;
