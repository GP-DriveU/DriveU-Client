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
  updateDirectoryOrder: (parentDirectoryId: number, newChildren: DirectoryItem[]) => void;
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
          const updatedDirs = state.semesterDirectories[key].map((dir) => {
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
