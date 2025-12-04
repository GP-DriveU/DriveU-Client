import { create } from "zustand";
import { persist } from "zustand/middleware";

const TOTAL_STORAGE_BYTES = 5 * 1024 * 1024 * 1024;

interface StorageState {
  totalStorage: number;
  remainingStorage: number;
  setRemainingStorage: (bytes: number) => void;
}

export const useStorageStore = create<StorageState>()(
  persist(
    (set) => ({
      totalStorage: TOTAL_STORAGE_BYTES,
      remainingStorage: TOTAL_STORAGE_BYTES,
      setRemainingStorage: (bytes) => set({ remainingStorage: bytes }),
    }),
    {
      name: "storage-storage",
      partialize: (state) => ({ remainingStorage: state.remainingStorage }),
    }
  )
);
