export type ItemType = "FILE" | "NOTE" | "LINK";

export interface Item {
  id: number;
  type: ItemType;
  title: string;
  url: string;
  previewLine: string;
  description: string;
  extension: string;
  isSelected: boolean;
  isFavorite: boolean;
  iconType: string;
  tag?: {
    tagId: number;
    tagName: string;
  } | null;
}
