import { create } from "zustand";
import { type Item } from "@/types/Item";

interface FilePreviewState {
  previewItem: Item | null;
  openPreview: (item: Item) => void;
  closePreview: () => void;
}

export const useFilePreviewStore = create<FilePreviewState>((set) => ({
  previewItem: null,
  openPreview: (item) => set({ previewItem: item }),
  closePreview: () => set({ previewItem: null }),
}));
