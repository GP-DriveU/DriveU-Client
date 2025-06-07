import { http } from "./Fetch";

export interface UploadRequest {
  filename: string;
  fileSize: number;
}

export interface UploadResponse {
  url: string;
  s3Path: string;
}

export interface RegisterLinkRequest {
  title: string;
  url: string;
  tagId: number;
}
export interface RegisterLinkResponse {
  linkId: string;
}

export interface RegisterFileMetaRequest {
  title: string;
  s3Path: string;
  extension: string;
  size: number;
  tagId?: string;
}
export interface RegisterFileMetaResponse {
  fileId: string;
}

export interface ToggleFavoriteResponse {
  id: number;
  favorite: boolean;
}

export interface DeleteResourceResponse {
  id: number;
  deletedAt: string;
  deleted: boolean;
}

// GET: 파일 다운로드용 presigned URL
export const getDownloadPresignedUrl = async (resourceId: number): Promise<string> => {
  const response = await http.get<{ url: string }>(
    `resources/${resourceId}/download`
  );
  return response.response.url;
};

// GET: 파일 업로드용 presigned URL
export const getUploadPresignedUrl = async (
  data: UploadRequest
) => {
  const response = await http.get<UploadResponse>("file/upload", {
    filename: data.filename ?? "",
    fileSize: data.fileSize.toString(),
  });
  return response.response;
};


// POST: 링크 등록
export const registerLink = async (
  directoryId: number,
  data: RegisterLinkRequest
): Promise<RegisterLinkResponse> => {
  const response = await http.post<RegisterLinkResponse>(
    `directories/${directoryId}/links`,
    data
  );
  return response.response;
};

// POST: 파일 메타데이터 등록
export const registerFileMeta = async (
  directoryId: number,
  data: RegisterFileMetaRequest
): Promise<RegisterFileMetaResponse> => {
  const response = await http.post<RegisterFileMetaResponse>(
    `directories/${directoryId}/files`,
    data
  );
  return response.response;
};

// PATCH: 즐겨찾기 추가/삭제
export const toggleFavoriteResource = async (
  resourceId: number
): Promise<ToggleFavoriteResponse> => {
  const response = await http.patch<ToggleFavoriteResponse>(
    `resources/${resourceId}/favorite`
  );
  return response.response;
};

// GET: 링크 바로가기
export const getLinkUrl = async (
  linkId: number
): Promise<{ url: string }> => {
  const response = await http.get<{ url: string }>(`links/${linkId}`);
  return response.response;
};

// GET: 디렉토리 별 리소스 필터링 조회
export const getResourcesByDirectory = async (
  directoryId: number,
  params?: { sort?: string; favoriteOnly?: boolean }
): Promise<any[]> => {
  const query: Record<string, string> = {};
  if (params?.sort) query.sort = params.sort;
  if (params?.favoriteOnly) query.favoriteOnly = String(params.favoriteOnly);

  const response = await http.get<any[]>(
    `directories/${directoryId}/resources`,
    query
  );
  return response.response;
};

// DELETE: 리소스 삭제
export const deleteResource = async (
  resourceId: number
): Promise<DeleteResourceResponse> => {
  const response = await http.delete<DeleteResourceResponse>(
    `resources/${resourceId}`
  );
  return response.response;
};