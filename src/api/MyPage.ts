import { http } from "@/api/Fetch";

export interface UserInfoResponse {
  id: number;
  name: string;
  email: string;
  semesters: {
    userSemesterId: number;
    year: number;
    term: "SPRING" | "SUMMER" | "FALL" | "WINTER";
    isCurrent: boolean;
  }[];
}

export interface SemesterRequest {
  year: number;
  term: "SPRING" | "SUMMER" | "FALL" | "WINTER";
}

export interface SemesterResponse {
  userSemesterId: number;
  year: number;
  term: "SPRING" | "SUMMER" | "FALL" | "WINTER";
  isCurrent: boolean;
}

export const getUserInfo = async () => {
  const response = await http.get<UserInfoResponse>("mypage");
  return response.response;
};

// 학기 생성
export const createSemester = async (data: SemesterRequest) => {
  const response = await http.post<SemesterResponse>("semesters", data);
  return response.response;
};

// 학기 수정
export const updateSemester = async (
  userSemesterId: number,
  data: SemesterRequest
) => {
  const response = await http.put<SemesterResponse>(
    `semesters/${userSemesterId}`,
    data
  );
  return response.response;
};

// 학기 삭제
export const deleteSemester = async (userSemesterId: number) => {
  const response = await http.delete<SemesterResponse>(
    `semesters/${userSemesterId}`
  );
  return response.response;
};
