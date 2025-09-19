import { IconDocs, IconNote } from "@/assets";
import { type ItemType } from "@/types/Item";

export const getIcon = (type: ItemType) => {
  switch (type) {
    case "FILE":
      return <IconDocs />;
    case "NOTE":
      return <IconNote />;
    default:
      return <IconDocs />;
  }
};
