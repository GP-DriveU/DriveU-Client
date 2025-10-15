export const FILE_TYPE_OPTIONS = {
  all: "전체",
  file: "파일",
  note: "필기",
  link: "링크",
  directory: "디렉토리",
};

export type TrashSortType =
  | "deletedAt,asc"
  | "deletedAt,desc"
  | "name,asc"
  | "name,desc";
