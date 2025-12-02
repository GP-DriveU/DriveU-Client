import List from "@/commons/list/List";
import ListItem from "@/commons/list/ListItem";
import { getIcon } from "@/utils/itemUtils";
import { type Item } from "@/types/Item";
import { IconCheck, IconDownload, IconFavorite } from "@/assets";
import { getDownloadPresignedUrl } from "@/api/File";
import { getNote } from "@/api/Note";
import EmptySection from "@/commons/section/EmptySection";
import { useFilePreviewStore } from "@/store/useFilePreviewStore";

interface MainFileListProps {
  items: Item[];
  onToggleSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  selectable: boolean;
  onClickItem: (id: number) => void;
}

function MainFileList({
  items,
  onToggleSelect,
  onToggleFavorite,
  selectable,
  onClickItem,
}: MainFileListProps) {
  const { openPreview } = useFilePreviewStore();

  const handlePreviewClick = (e: React.MouseEvent, item: Item) => {
    e.stopPropagation();
    openPreview(item);
  };

  const handleDownload = async (item: Item) => {
    try {
      if (item.type === "NOTE") {
        const note = await getNote(item.id);
        const blob = new Blob([note.content || "내용이 없습니다."], {
          type: "text/markdown",
        });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${item.title}.md`;
        a.click();
        URL.revokeObjectURL(a.href);
      } else {
        const url = await getDownloadPresignedUrl(Number(item.id));
        const a = document.createElement("a");
        a.href = url;
        const baseTitle = item.title.endsWith(`.${item.extension}`)
          ? item.title.slice(0, -(item.extension.length + 1))
          : item.title;
        a.download = `${baseTitle}.${item.extension}`;
        a.click();
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <List
      items={items}
      emptyComponent={
        <div className="w-full h-full flex flex-col items-center justify-center">
          <EmptySection
            title="저장된 파일 및 노트 없음"
            subtitle="새로운 파일이나 노트를 업로드하세요."
          />
        </div>
      }
      renderItem={(item) => {
        const canPreview =
          item.type === "FILE" &&
          ["png", "jpg", "jpeg", "gif", "webp", "pdf"].includes(
            item.extension?.toLowerCase()
          );

        return (
          <ListItem
            onClick={() => onClickItem(item.id)}
            leading={
              selectable ? (
                <div
                  className="w-5 h-5 min-w-[20px] min-h-[20px] flex items-center bg-primary_light justify-center rounded-sm cursor-pointer"
                  style={{ border: "0.5px solid #4B5563" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(item.id);
                  }}
                >
                  {item.isSelected && (
                    <IconCheck className="w-3 h-3 text-blue-600" />
                  )}
                </div>
              ) : (
                getIcon(item.type, item.iconType)
              )
            }
            children={
              <div className="flex items-center gap-2">
                <div
                  className="w-40 truncate cursor-pointer"
                  title={item.title}
                >
                  {item.title}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  className="cursor-pointer flex-shrink-0 z-10 p-1"
                >
                  <IconFavorite
                    className={item.favorite ? "text-danger" : "text-gray-300"}
                  />
                </div>
                {item.tag && (
                  <span className="text-xs text-center outline outline-1 outline-offset-[-1px] outline-tag-yellow bg-tag-yellow/50 text-font px-3 py-0.5 rounded-[5px]">
                    {item.tag.tagName}
                  </span>
                )}

                {canPreview && (
                  <button
                    onClick={(e) => handlePreviewClick(e, item)}
                    className="pl-4 text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 whitespace-nowrap transition-colors"
                  >
                    미리보기
                  </button>
                )}
              </div>
            }
            actions={
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(item);
                }}
                className="w-[30px] h-[30px] flex items-center justify-center"
              >
                <IconDownload />
              </button>
            }
          />
        );
      }}
    />
  );
}

export default MainFileList;
