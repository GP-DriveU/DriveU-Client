import { http } from "@/api/Fetch";

interface SummaryResponse {
  summaryId: number;
  summary: string;
}

export const getNoteSummary = async (
  noteId: number
): Promise<SummaryResponse> => {
  const response = await http.get<SummaryResponse>(`note/${noteId}/summary`);
  return response.response;
};

export const createNoteSummary = async (
  noteId: number
): Promise<SummaryResponse> => {
  const response = await http.post<SummaryResponse>(`v2/note/${noteId}/summary`);
  return response.response;
};
