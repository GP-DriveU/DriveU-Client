import { http } from "@/api/Fetch";

export interface QuestionGenerationRequest {
  resourceId: number;
  type: "FILE" | "NOTE";
  tagId: number;
}

export interface QuestionItem {
  type: "multiple_choice" | "short_answer";
  question: string;
  options: string[] | null;
  answer: string;
}

export interface QuestionGenerationResponse {
  questionId: number;
  title: string;
  version: number;
  questions: QuestionItem[];
}

export interface SemesterQuestionSummary {
  questionId: number;
  title: string;
  version: number;
  createdAt: string;
}

export const generateQuestions = async (
  directoryId: number,
  data: QuestionGenerationRequest[]
): Promise<QuestionGenerationResponse> => {
  const response = await http.post<QuestionGenerationResponse>(
    `directories/${directoryId}/questions`,
    data
  );
  return response.response;
};

export const fetchSemesterQuestions = async (
  userSemesterId: number
): Promise<SemesterQuestionSummary[]> => {
  const response = await http.get<SemesterQuestionSummary[]>(
    `user-semesters/${userSemesterId}/questions`
  );
  return response.response;
};

export const fetchQuestionDetail = async (
  questionId: number
): Promise<QuestionGenerationResponse> => {
  const response = await http.get<QuestionGenerationResponse>(
    `questions/${questionId}`
  );
  return response.response;
};
