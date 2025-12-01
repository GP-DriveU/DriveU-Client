import {
  IconAdd,
  IconDocs,
  IconLink,
  IconNote,
  IconGithub,
  IconYoutube,
} from "@/assets";
import { type ItemType } from "@/types/Item";

export const getIcon = (type: ItemType, iconType?: string) => {
  switch (type) {
    case "LINK":
      switch (iconType) {
        case "GITHUB":
          return <IconGithub />;
        case "YOUTUBE":
          return <IconYoutube />;
        default:
          return <IconLink />;
      }
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
