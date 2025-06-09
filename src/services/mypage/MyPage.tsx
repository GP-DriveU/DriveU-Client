import { useEffect, useState } from "react";
import {
  getUserInfo,
  createSemester,
  updateSemester,
  deleteSemester as apiDeleteSemester,
  type UserInfoResponse,
} from "../../api/MyPage";
import TitleSection from "../../commons/section/TitleSection";
import MyPageSection from "./MyPageSection";
import EditSemester from "./EditSemester";
import AlertModal from "../../commons/modals/AlertModal";
import Button from "../../commons/inputs/Button";
import { useAuthStore } from "../../store/useAuthStore";

const formatSemester = (s: { year: number; term: string }) =>
  `${String(s.year).slice(2)}년 ${s.term === "SPRING" ? "1학기" : "2학기"}`;

function MyPage() {
  const [user, setUser] = useState<UserInfoResponse | null>(null);
  const [semesterData, setSemesterData] = useState<
    UserInfoResponse["semesters"]
  >([]);
  const [isEditingSemester, setIsEditingSemester] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const data = await getUserInfo();
      setUser(data);
      setSemesterData(data.semesters);
    };
    fetchUserInfo();
  }, []);

  const deleteSemester = async (semesterLabel: string) => {
    const filtered = semesterData.filter(
      (s) => formatSemester(s).trim() !== semesterLabel.trim()
    );
    setSemesterData(filtered);

    const target = semesterData.find(
      (s) => formatSemester(s).trim() === semesterLabel.trim()
    );
    if (target) {
      await apiDeleteSemester(target.userSemesterId);
    }
  };

  const toggleSemesterEdit = () => setIsEditingSemester((prev) => !prev);

  return (
    <div className="w-full flex bg-white flex-col">
      <TitleSection title="마이페이지" semester="" />

      <div className="flex flex-col w-full px-6">
        <MyPageSection
          label="이름"
          value={user?.name ?? ""}
          onEdit={() => {}}
          showEditButton={false}
        />

        <MyPageSection
          label="이메일"
          value={user?.email ?? ""}
          onEdit={() => {}}
          showEditButton={false}
        />

        <MyPageSection
          label="학기"
          value={formatSemester(
            semesterData.find((s) => s.isCurrent) ?? { year: 0, term: "SPRING" }
          )}
          isEditing={isEditingSemester}
          showEditButton={!isEditingSemester}
          editElement={
            <>
              <div className="w-full h-full">
                <EditSemester
                  semesters={semesterData.map(formatSemester)}
                  onRequestDelete={(semester) => setDeleteTarget(semester)}
                  setSemesters={(updatedArray) => {
                    if (!Array.isArray(updatedArray)) return;

                    // Always set full edited string array directly as semesterData for now
                    const mapped = updatedArray
                      .map((s) => {
                        const trimmed = s.trim();
                        if (!/^\d{4}년 [12]학기$/.test(trimmed)) {
                          return null;
                        }
                        const [yearStr, termStr] = trimmed.split("년 ");
                        const year = parseInt(yearStr, 10);
                        const term = termStr === "1학기" ? "SPRING" : "FALL";
                        return {
                          year,
                          term,
                          isCurrent: false,
                          userSemesterId: 0,
                        };
                      })
                      .filter(Boolean) as UserInfoResponse["semesters"];

                    setSemesterData(mapped);
                  }}
                  onEditComplete={() => setIsEditingSemester(false)}
                  onCreateSemester={async (newSemester) => {
                    const created = await createSemester(newSemester);
                    setSemesterData((prev) => [...prev, created]);
                    return created;
                  }}
                  onUpdateSemester={async (index, updatedSemester) => {
                    const target = semesterData[index];
                    if (!target) return;
                    const updated = await updateSemester(
                      target.userSemesterId,
                      updatedSemester
                    );
                    const copy = [...semesterData];
                    copy[index] = updated;
                    setSemesterData(copy);
                  }}
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
        <div className="w-64 my-16 mx-auto flex justify-center">
          <Button size="medium" color="primary" onClick={logout}>
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
