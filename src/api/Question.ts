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

export interface QuestionResultItem {
  questionIndex: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuestionGenerationResponse {
  questionId: number;
  title: string;
  version: number;
  questions: QuestionItem[];
  isSolved: boolean;
  results: QuestionResultItem[] | null;
}

export interface SemesterQuestionSummary {
  questionId: number;
  title: string;
  version: number;
  createdAt: string;
}

export interface QuestionTitleUpdateResponse {
  questionId: number;
  title: string;
  version: number;
  updatedAt: string;
}

export interface QuestionSubmissionRequest {
  submissions: {
    questionIndex: number;
    userAnswer: string;
  }[];
}

export interface QuestionSubmissionResponse {
  questionId: number;
  submittedAt: string;
  results: QuestionResultItem[];
  isSolved: boolean;
}

export const generateQuestions = async (
  directoryId: number,
  data: QuestionGenerationRequest[]
): Promise<QuestionGenerationResponse> => {
  const response = await http.post<QuestionGenerationResponse>(
    `v2/directories/${directoryId}/questions`,
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

export const updateQuestionTitle = async (
  questionId: number,
  title: string
): Promise<QuestionTitleUpdateResponse> => {
  const response = await http.patch<QuestionTitleUpdateResponse>(
    `questions/${questionId}/title`,
    { title }
  );
  return response.response;
};

export const submitQuestionResults = async (
  questionId: number,
  submissions: QuestionSubmissionRequest
): Promise<QuestionSubmissionResponse> => {
  const response = await http.post<QuestionSubmissionResponse>(
    `questions/${questionId}/submit`,
    submissions
  );
  return response.response;
};
