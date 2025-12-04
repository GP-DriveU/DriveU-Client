import { useMemo } from "react";
import { useSemesterStore } from "@/store/useSemesterStore";
import { useDirectoryStore } from "@/store/useDirectoryStore";

export function useSemesterDirectoriesStore() {
  const { selectedSemesterKey } = useSemesterStore();

  const { year, term } = useMemo(() => {
    if (!selectedSemesterKey) return { year: 0, term: "" };
    const [y, t] = selectedSemesterKey.split("-");
    return { year: Number(y), term: t };
  }, [selectedSemesterKey]);

  const directories = useDirectoryStore((state) =>
    state.getDirectoriesBySemester(year, term)
  );

  const studyDirectory = directories.find((dir) => dir.name === "학업");
  const studyDirectoryId = studyDirectory?.id;

  return { directories, studyDirectory, studyDirectoryId, year, term };
}
