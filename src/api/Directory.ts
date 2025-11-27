import { http } from "@/api/Fetch";
import type { DirectoryItem } from "@/types/directory";


interface CreateDirectoryRequest {
  parentDirectoryId: number | undefined;
  name: string;
}

interface CreateDirectoryResponse {
  id: number;
  name: string;
  order: number;
}

interface UpdateDirectoryParentRequest {
  newParentId: number;
}

interface UpdateDirectoryParentResponse {
  id: number;
  name: string;
  parentId: number;
  order: number;
}

interface UpdateDirectoryNameRequest {
  name: string;
}

interface UpdateDirectoryNameResponse {
  id: number;
  name: string;
}

interface DirectoryOrderUpdate {
  directoryId: number;
  order: number;
}

interface UpdateDirectoriesOrderRequest {
  parentDirectoryId: number;
  updates: DirectoryOrderUpdate[];
}

interface ReorderedDirectory {
  directoryId: number;
  name: string;
  order: number;
}

interface UpdateDirectoriesOrderResponse {
  parentDirectoryId: number;
  reorderedDirectories: ReorderedDirectory[];
}

export const fetchDirectory = async (
  userSemesterId: number,
): Promise<DirectoryItem[]> => {
  const response = await http.get<DirectoryItem[]>(
    `user-semesters/${userSemesterId}/directories`
  );
  return response.response;
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

export const updateDirectoryParent = async (
  directoryId: number,
  payload: UpdateDirectoryParentRequest
): Promise<UpdateDirectoryParentResponse> => {
  const response = await http.patch<UpdateDirectoryParentResponse>(
    `directories/${directoryId}/parent`,
    payload
  );
  return response.response;
};

export const updateDirectoryName = async (
  directoryId: number,
  payload: UpdateDirectoryNameRequest
): Promise<UpdateDirectoryNameResponse> => {
  const response = await http.patch<UpdateDirectoryNameResponse>(
    `directories/${directoryId}/name`,
    payload
  );
  return response.response;
};

export const updateDirectoriesOrder = async (
  payload: UpdateDirectoriesOrderRequest
): Promise<UpdateDirectoriesOrderResponse> => {
  const response = await http.patch<UpdateDirectoriesOrderResponse>(
    `directories/order`,
    payload
  );
  return response.response;
};

export const deleteDirectory = async (
  directoryId: number
): Promise<{ message: string }> => {
  const response = await http.delete<{ message: string }>(
    `directories/${directoryId}`
  );
  return response.response;
};
