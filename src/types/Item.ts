export type ItemType = "FILE" | "NOTE" | "LINK";

export interface Item {
  id: string;
  title: string;
  description: string;
  type: ItemType;
  category: string;
  isSelected: boolean;
  isFavorite: boolean;
}
