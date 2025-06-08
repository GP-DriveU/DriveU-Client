import { useDirectoryStore } from "./useDirectoryStore";
import { useTagStore } from "./useTagStore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Semester = {
  userSemesterId: number;
  year: number;
  term: "SPRING" | "SUMMER" | "FALL" | "WINTER";
  isCurrent: boolean;
};

type SemesterState = {
  selectedSemesterKey: string | null;
  setSelectedSemester: (year: number, term: Semester["term"]) => void;
  semesters: Semester[];
  setSemesters: (semesters: Semester[]) => void;
  getCurrentSemester: () => Semester | undefined;
};

export const useSemesterStore = create<SemesterState>()(
  persist(
    (set, get) => ({
      semesters: [],
      selectedSemesterKey: null,
      setSemesters: (semesters) => set({ semesters }),
      setSelectedSemester: (year, term) => {
        set({ selectedSemesterKey: `${year}-${term}` });
        const directories = useDirectoryStore
          .getState()
          .getCurrentDirectories();
        const tags = directories
          .flatMap((dir) => dir.children ?? [])
          .map((child) => ({
            id: child.id,
            title: child.name,
            color: "#A1A1AA",
          }));
        useTagStore.getState().setTags(tags);
      },
      getCurrentSemester: () =>
        get().semesters.find((semester) => semester.isCurrent),
    }),
    {
      name: "semester-storage",
      partialize: (state) => ({
        semesters: state.semesters,
        selectedSemesterKey: state.selectedSemesterKey,
      }),
    }
  )
);
