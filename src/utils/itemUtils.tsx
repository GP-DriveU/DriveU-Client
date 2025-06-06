import IconDocs from "../assets/icon/icon_docs.svg?react";
import IconNote from "../assets/icon/icon_note.svg?react";
import { type ItemType } from "../types/Item";

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
