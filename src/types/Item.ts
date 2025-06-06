export type ItemType = "FILE" | "NOTE" | "LINK";

export interface Item {
  id: string;
  title: string;
  description: string;
  type: ItemType;
  categories: string[];
  isSelected: boolean;
  isFavorite: boolean;
}
