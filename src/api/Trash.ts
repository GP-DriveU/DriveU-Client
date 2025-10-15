import { http } from "@/api/Fetch";
import type { ItemType } from "@/types/Item";
import type { TrashSortType } from "@/types/trash";

export interface TrashResource {
  id: number;
  name: string;
  type: ItemType;
  deletedAt: string;
}

export interface GetTrashItemsResponse {
  resources: TrashResource[];
}

export interface GetTrashDirectoryChildrenResponse {
  directory: TrashResource;
  children: TrashResource[];
}

export interface ApiMessageResponse {
  message: string;
}

// 휴지통 파일 조회
export const getTrashItems = async (
  types: string[],
  sort: TrashSortType
): Promise<GetTrashItemsResponse> => {
  // URLSearchParams를 사용하여 쿼리 파라미터 생성
  const params = new URLSearchParams();
  params.append("sort", sort);

  // 'all'이 아니거나 types 배열이 비어있지 않은 경우에만 type 파라미터 추가
  if (types.length > 0 && types[0].toUpperCase() !== "ALL") {
    types.forEach((type) => {
      params.append("type", type.toUpperCase());
    });
  }

  const response = await http.get<GetTrashItemsResponse>(
    `trash?${params.toString()}`
  );
  return response.response;
};

// 휴지통 디렉토리 조회
export const getTrashDirectoryChildren = async (
  directoryId: number,
  sort: TrashSortType
): Promise<GetTrashDirectoryChildrenResponse> => {
  const response = await http.get<GetTrashDirectoryChildrenResponse>(
    `trash/${directoryId}/children?sort=${sort}`
  );
  return response.response;
};

// 휴지통 비우기
export const emptyTrash = async (): Promise<ApiMessageResponse> => {
  const response = await http.delete<ApiMessageResponse>("trash");
  return response.response;
};

// 휴지통 파일 지우기
export const deleteTrashFile = async (
  resourceId: number
): Promise<ApiMessageResponse> => {
  const response = await http.delete<ApiMessageResponse>(
    `trash/resources/${resourceId}`
  );
  return response.response;
};

// 휴지통 디렉토리 지우기
export const deleteTrashDirectory = async (
  directoryId: number
): Promise<ApiMessageResponse> => {
  const response = await http.delete<ApiMessageResponse>(
    `trash/directories/${directoryId}`
  );
  return response.response;
};

// 휴지통 파일 복원
export const restoreFile = async (
  resourceId: number
): Promise<ApiMessageResponse> => {
  const response = await http.post<ApiMessageResponse>(
    `trash/resources/${resourceId}/restore`
  );
  return response.response;
};

// 휴지통 디렉토리 복원
export const restoreDirectory = async (
  directoryId: number
): Promise<ApiMessageResponse> => {
  const response = await http.post<ApiMessageResponse>(
    `trash/directories/${directoryId}/restore`
  );
  return response.response;
};
