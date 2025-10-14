import { IconAdd, IconDocs, IconNote } from "@/assets";
import { type ItemType } from "@/types/Item";

export const getIcon = (type: ItemType) => {
  switch (type) {
    case "FILE":
      return <IconDocs />;
    case "NOTE":
      return <IconNote />;
    case "DIRECTORY":
      return <IconAdd />;
    default:
      return <IconDocs />;
  }
};
