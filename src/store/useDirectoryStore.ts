import { create } from "zustand";

interface DirectoryItem {
  id: number;
  name: string;
  is_default: boolean;
  order: number;
  children: DirectoryItem[];
}

interface SidebarStore {
  selectedSemester: string;
  semesterDirectories: Record<string, DirectoryItem[]>;
  setSelectedSemester: (semester: string) => void;
  setSemesterDirectories: (semester: string, dirs: DirectoryItem[]) => void;
  getCurrentDirectories: () => DirectoryItem[];
}

export const useDirectoryStore = create<SidebarStore>((set, get) => ({
  selectedSemester: "2024-1",
  semesterDirectories: {},
  setSelectedSemester: (semester) => set({ selectedSemester: semester }),
  setSemesterDirectories: (semester, dirs) =>
    set((state) => ({
      semesterDirectories: {
        ...state.semesterDirectories,
        [semester]: dirs,
      },
    })),
  getCurrentDirectories: () => {
    const { selectedSemester, semesterDirectories } = get();
    return semesterDirectories[selectedSemester] ?? [];
  },
}));
