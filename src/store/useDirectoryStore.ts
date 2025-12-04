import { fetchDirectory } from "@/api/Directory";
import type { DirectoryItem } from "@/types/directory";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const getSemesterKey = (year: number, term: string) => `${year}-${term}`;

interface DirectoryStore {
  semesterDirectories: Record<string, DirectoryItem[]>;
  setSemesterDirectories: (
    year: number,
    term: string,
    dirs: DirectoryItem[] | ((prev: DirectoryItem[]) => DirectoryItem[])
  ) => void;
  setDirectoriesFromServer: (
    semesterData: { year: number; term: string; directories: DirectoryItem[] }[]
  ) => void;
  getDirectoriesBySemester: (year: number, term: string) => DirectoryItem[];
  updateDirectoryOrder: (
    year: number,
    term: string,
    parentDirectoryId: number,
    newChildren: DirectoryItem[]
  ) => void;
  moveDirectory: (
    year: number,
    term: string,
    directoryId: number,
    oldParentId: number,
    newParentId: number
  ) => void;
  updateDirectoryName: (
    year: number,
    term: string,
    parentDirectoryId: number,
    directoryId: number,
    newName: string
  ) => void;
  fetchAndUpdateDirectories: (
    userSemesterId: number,
    year: number,
    term: string
  ) => Promise<void>;
}

export const useDirectoryStore = create<DirectoryStore>()(
  persist(
    (set, get) => ({
      semesterDirectories: {},
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
      getDirectoriesBySemester: (year, term) => {
        const key = getSemesterKey(year, term);
        const dirs = get().semesterDirectories[key] ?? [];
        return dirs;
      },
      updateDirectoryOrder: (year, term, parentDirectoryId, newChildren) => {
        const key = getSemesterKey(year, term);

        set((state) => {
          const currentDirs = state.semesterDirectories[key] ?? [];
          if (currentDirs.length === 0) return state;

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
      moveDirectory: (year, term, directoryId, oldParentId, newParentId) => {
        const key = getSemesterKey(year, term);

        set((state) => {
          const currentDirs = state.semesterDirectories[key] ?? [];
          if (currentDirs.length === 0) return state;

          let itemToMove: DirectoryItem | undefined;

          const afterRemoveDirs = currentDirs.map((dir) => {
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

          const finalDirs = afterRemoveDirs.map((dir) => {
            if (dir.id === newParentId) {
              return {
                ...dir,
                children: [...dir.children, itemToMove!],
              };
            }
            return dir;
          });

          return {
            semesterDirectories: {
              ...state.semesterDirectories,
              [key]: finalDirs,
            },
          };
        });
      },
      updateDirectoryName: (
        year,
        term,
        parentDirectoryId,
        directoryId,
        newName
      ) => {
        const key = getSemesterKey(year, term);

        set((state) => {
          const currentDirs = state.semesterDirectories[key] ?? [];
          if (currentDirs.length === 0) return state;

          const updatedDirs = currentDirs.map((dir) => {
            if (dir.id === parentDirectoryId) {
              return {
                ...dir,
                children: dir.children.map((child) => {
                  if (child.id === directoryId) {
                    return { ...child, name: newName };
                  }
                  return child;
                }),
              };
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
      fetchAndUpdateDirectories: async (userSemesterId, year, term) => {
        try {
          const directories = await fetchDirectory(userSemesterId);
          get().setSemesterDirectories(year, term, directories);
        } catch (error) {
          console.error("디렉토리 목록 업데이트 실패:", error);
          throw error;
        }
      },
    }),
    {
      name: "directory-storage",
      partialize: (state) => ({
        semesterDirectories: state.semesterDirectories,
      }),
    }
  )
);
