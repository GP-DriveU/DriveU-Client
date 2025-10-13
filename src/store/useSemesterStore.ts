import type { TermType } from "@/types/semester";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Semester = {
  userSemesterId: number;
  year: number;
  term: TermType;
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
