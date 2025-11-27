export interface DirectoryItem {
  id: number;
  name: string;
  is_default: boolean;
  order: number;
  children: DirectoryItem[];
}
