export const SORT_FIELDS = {
  name: "이름",
  deleteDate: "삭제일",
} as const;

export const SORT_ORDERS = {
  asc: "오름차순",
  desc: "내림차순",
} as const;

export type SortField = keyof typeof SORT_FIELDS;
export type SortOrder = keyof typeof SORT_ORDERS;

export interface SortOption {
  field: SortField;
  order: SortOrder;
}
