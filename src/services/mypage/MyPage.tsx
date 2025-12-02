import { useEffect, useState } from "react";
import {
  getUserInfo,
  createSemester,
  updateSemester,
  deleteSemester as apiDeleteSemester,
  type UserInfoResponse,
} from "@/api/MyPage";
import TitleSection from "@/commons/section/TitleSection";
import AlertModal from "@/commons/modals/AlertModal";
import Button from "@/commons/inputs/Button";
import { useAuthStore } from "@/store/useAuthStore";
import MyPageSection from "@/services/mypage/MyPageSection";
import EditSemester from "@/services/mypage/EditSemester";
import { useSemesterStore } from "@/store/useSemesterStore";

const formatSemester = (s: { year: number; term: string }) =>
  `${s.year}년 ${s.term === "SPRING" ? "1학기" : "2학기"}`;

function MyPage() {
  const [user, setUser] = useState<UserInfoResponse | null>(null);
  const [semesterData, setSemesterData] = useState<
    UserInfoResponse["semesters"]
  >([]);
  const [isEditingSemester, setIsEditingSemester] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const logout = useAuthStore((state) => state.logout);
  const { setSemesters: setStoreSemesters } = useSemesterStore();

  const syncStore = (newSemesters: UserInfoResponse["semesters"]) => {
    setStoreSemesters(
      newSemesters.map((s) => ({
        userSemesterId: s.userSemesterId,
        year: s.year,
        term: s.term,
        isCurrent: s.isCurrent,
      }))
    );
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const data = await getUserInfo();
      setUser(data);
      setSemesterData(data.semesters);
      syncStore(data.semesters);
    };
    fetchUserInfo();
  }, []);

  const deleteSemester = async (semesterLabel: string) => {
    const target = semesterData.find(
      (s) => formatSemester(s).trim() === semesterLabel.trim()
    );

    if (target) {
      await apiDeleteSemester(target.userSemesterId);

      const filtered = semesterData.filter(
        (s) => s.userSemesterId !== target.userSemesterId
      );
      setSemesterData(filtered);

      syncStore(filtered);
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
                  setSemesters={() => {}}
                  onEditComplete={() => setIsEditingSemester(false)}
                  onCreateSemester={async (newSemester) => {
                    const created = await createSemester(newSemester);
                    const newData = [...semesterData, created];
                    setSemesterData(newData);
                    syncStore(newData);
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
                    syncStore(copy);
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
