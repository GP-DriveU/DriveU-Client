import type { Item } from "@/types/Item";
import { http } from "@/api/Fetch";

export interface Directory {
  id: number;
  name: string;
  is_default: boolean;
  order: number;
  children: Directory[];
}

export interface MainPageResponse {
  directories: Directory[];
  recentFiles: Item[];
  favoriteFiles: Item[];
}

export const getMainPage = async (
  userSemesterId: number
): Promise<MainPageResponse> => {
  const response = await http.get<MainPageResponse>(
    `semesters/${userSemesterId}/mainpage`
  );
  return response.response;
};
