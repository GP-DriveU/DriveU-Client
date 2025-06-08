import { http } from "./Fetch";

interface CreateDirectoryRequest {
  parentDirectoryId: number | undefined;
  name: string;
}

interface CreateDirectoryResponse {
  id: number;
  name: string;
  order: number;
}

export const createDirectory = async (
  userSemesterId: number,
  payload: CreateDirectoryRequest
): Promise<CreateDirectoryResponse> => {
  const response = await http.post<CreateDirectoryResponse>(
    `user-semesters/${userSemesterId}/directories`,
    payload
  );
  return response.response;
};
