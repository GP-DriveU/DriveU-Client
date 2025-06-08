import { http } from "./Fetch";

export interface GetNoteResponse {
  noteId: number;
  title: string;
  content: string;
  tag: {
    tagId: number;
    tagName: string;
  };
}

export const getNote = async (noteId: number): Promise<GetNoteResponse> => {
  const response = await http.get<GetNoteResponse>(`notes/${noteId}`);
  return response.response;
};