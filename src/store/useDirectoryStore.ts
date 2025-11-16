import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DirectoryItem {
  id: number;
  name: string;
  is_default: boolean;
  order: number;
  children: DirectoryItem[];
}

const getSemesterKey = (year: number, term: string) => `${year}-${term}`;

interface DirectoryStore {
  selectedSemesterKey: string;
  semesterDirectories: Record<string, DirectoryItem[]>;
  setSelectedSemester: (year: number, term: string) => void;
  setSemesterDirectories: (
    year: number,
    term: string,
    dirs: DirectoryItem[] | ((prev: DirectoryItem[]) => DirectoryItem[])
  ) => void;
  setDirectoriesFromServer: (
    semesterData: { year: number; term: string; directories: DirectoryItem[] }[]
  ) => void;
  getCurrentDirectories: () => DirectoryItem[];
  updateDirectoryOrder: (
    parentDirectoryId: number,
    newChildren: DirectoryItem[]
  ) => void;
  moveDirectory: (
    directoryId: number,
    oldParentId: number,
    newParentId: number
  ) => void;
}

export const useDirectoryStore = create<DirectoryStore>()(
  persist(
    (set, get) => ({
      selectedSemesterKey: "",
      semesterDirectories: {},
      setSelectedSemester: (year, term) => {
        const key = getSemesterKey(year, term);
        set({ selectedSemesterKey: key });
      },
      setSemesterDirectories: (year, term, dirs) =>
        set((state) => {
          const key = getSemesterKey(year, term);
          const currentDirs = state.semesterDirectories[key] ?? [];
          const updatedDirs =
            typeof dirs === "function" ? dirs(currentDirs) : dirs;

          return {
            semesterDirectories: {
              ...state.semesterDirectories,
              [key]: updatedDirs,
            },
          };
        }),
      setDirectoriesFromServer: (semesterData) => {
        const mapped: Record<string, DirectoryItem[]> = {};

        semesterData.forEach(({ year, term, directories }) => {
          const key = getSemesterKey(year, term);
          mapped[key] = directories;
        });

        set((state) => ({
          semesterDirectories: {
            ...state.semesterDirectories,
            ...mapped,
          },
        }));
      },
      getCurrentDirectories: () => {
        const key = get().selectedSemesterKey;
        const dirs = get().semesterDirectories[key] ?? [];
        return dirs;
      },
      updateDirectoryOrder: (parentDirectoryId, newChildren) => {
        const key = get().selectedSemesterKey;
        if (!key) return;

        set((state) => {
          const currentDirs = state.semesterDirectories[key] ?? [];
          const updatedDirs = currentDirs.map((dir) => {
            if (dir.id === parentDirectoryId) {
              return { ...dir, children: newChildren };
            }
            return dir;
          });

          return {
            semesterDirectories: {
              ...state.semesterDirectories,
              [key]: updatedDirs,
            },
          };
        });
      },
      moveDirectory: (directoryId, oldParentId, newParentId) => {
        const key = get().selectedSemesterKey;
        if (!key) return;

        set((state) => {
          const currentDirs = state.semesterDirectories[key] ?? [];
          let itemToMove: DirectoryItem | undefined;

          const updatedDirs = currentDirs.map((dir) => {
            if (dir.id === oldParentId) {
              itemToMove = dir.children.find((c) => c.id === directoryId);
              return {
                ...dir,
                children: dir.children.filter((c) => c.id !== directoryId),
              };
            }
            return dir;
          });

          if (!itemToMove) return state;

          const finalDirs = updatedDirs.map((dir) => {
            if (dir.id === newParentId) {
              return {
                ...dir,
                children: [...dir.children, itemToMove!],
              };
            }
            return dir;
          });

          // 3. 순서(order) 재정렬 (옵션: 여기서는 간단히 맨 뒤로 추가)
          //    정확한 순서 반영은 updateDirectoryOrder와 조합 필요

          return {
            semesterDirectories: {
              ...state.semesterDirectories,
              [key]: finalDirs,
            },
          };
        });
      },
    }),
    {
      name: "directory-storage",
      partialize: (state) => ({
        selectedSemesterKey: state.selectedSemesterKey,
        semesterDirectories: state.semesterDirectories,
      }),
    }
  )
);
