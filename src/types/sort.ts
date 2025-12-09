export const SORT_ORDERS = {
  asc: "오름차순",
  desc: "내림차순",
} as const;

export type SortOrder = keyof typeof SORT_ORDERS;

export interface SortOption<T extends string = string> {
  field: T;
  order: SortOrder;
}

export const TRASH_SORT_FIELDS = {
  name: "이름",
  deleteDate: "삭제일",
} as const;

export const FILE_SORT_FIELDS = {
  name: "이름",
  createdAt: "등록순",
  updatedAt: "최신순",
} as const;

export type TrashSortField = keyof typeof TRASH_SORT_FIELDS;
export type FileSortField = keyof typeof FILE_SORT_FIELDS;

export const LINK_TYPE_OPTIONS = {
  ALL: "전체",
  GITHUB: "Github",
  YOUTUBE: "Youtube",
  DEFAULT: "기타",
};

export const FAVORITE_OPTIONS = {
  all: "전체 파일",
  favorite: "즐겨찾기",
};
