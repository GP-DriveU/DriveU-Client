import { http } from "./Fetch";

export interface Directory {
  id: number;
  name: string;
  is_default: boolean;
  order: number;
  children: Directory[];
}

export interface FileItem {
  id: number;
  type: string;
  title: string;
  url: string;
  previewLine: string;
  extension: string;
  iconType: string;
  createdAt: string;
  updatedAt: string;
  tag: {
    tagId: number;
    tagName: string;
  };
  favorite: boolean;
}

export interface MainPageResponse {
  directories: Directory[];
  recentFiles: FileItem[];
  favoriteFiles: FileItem[];
}

export const getMainPage = async (
  userSemesterId: number
): Promise<MainPageResponse> => {
  const response = await http.get<MainPageResponse>(
    `semesters/${userSemesterId}/mainpage`
  );
  return response.response;
};
