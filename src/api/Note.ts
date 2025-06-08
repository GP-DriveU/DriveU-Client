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

export interface CreateNoteRequest {
  title: string;
  content: string;
  tagId: number;
}

export interface CreateNoteResponse {
  noteId: number;
  title: string;
  previewLink: string;
}

export interface UpdateNoteTitleRequest {
  title: string;
}

export interface UpdateNoteTitleResponse {
  noteId: number;
  title: string;
}

export interface UpdateNoteTagRequest {
  oldTagId: number;
  newTagId: number;
}

export interface UpdateNoteTagResponse {
  noteId: number;
  tag?: {
    tagId?: number;
    tagName?: string;
  };
}

export interface UpdateNoteContentRequest {
  content: string;
}
export interface UpdateNoteContentResponse {
  noteId: number;
  title: string;
  previewLink: string;
}

export const getNote = async (noteId: number): Promise<GetNoteResponse> => {
  const response = await http.get<GetNoteResponse>(`notes/${noteId}`);
  return response.response;
};

export const createNote = async (
  directoryId: number,
  payload: CreateNoteRequest
): Promise<CreateNoteResponse> => {
  const response = await http.post<CreateNoteResponse>(
    `directories/${directoryId}/notes`,
    payload
  );
  return response.response;
};

export const updateNoteTitle = async (
  noteId: number,
  title: string
): Promise<UpdateNoteTitleResponse> => {
  const response = await http.patch<UpdateNoteTitleResponse>(
    `notes/${noteId}/title`,
    { title } as UpdateNoteTitleRequest
  );
  return response.response;
};

export const updateNoteTag = async (
  noteId: number,
  oldTagId: number,
  newTagId: number | null
): Promise<UpdateNoteTagResponse> => {
  const response = await http.patch<UpdateNoteTagResponse>(
    `notes/${noteId}/tag`,
    { oldTagId, newTagId }
  );
  return response.response;
};

export const updateNoteContent = async (
  noteId: number,
  content: string
): Promise<UpdateNoteContentResponse> => {
  const response = await http.patch<UpdateNoteContentResponse>(
    `notes/${noteId}/content`,
    { content } as UpdateNoteContentRequest
  );
  return response.response;
};
