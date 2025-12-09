import {
  IconAdd,
  IconDocs,
  IconLink,
  IconNote,
  IconGithub,
  IconYoutube,
} from "@/assets";
import { type Item, type ItemType } from "@/types/Item";

export const getIcon = (type: ItemType, iconType?: string) => {
  const getTargetIcon = () => {
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

  return (
    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
      {getTargetIcon()}
    </div>
  );
};

export const canPreviewItem = (item: Item): boolean => {
  return (
    item.type === "FILE" &&
    ["png", "jpg", "jpeg", "gif", "webp", "pdf"].includes(
      item.extension?.toLowerCase()
    )
  );
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))}${sizes[i]}`;
};
