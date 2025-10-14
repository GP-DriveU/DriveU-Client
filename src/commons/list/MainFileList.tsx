import List from "@/commons/list/List";
import ListItem from "@/commons/list/ListItem";
import Button from "@/commons/inputs/Button";
import { getIcon } from "@/utils/itemUtils";
import { type Item } from "@/types/Item";
import { IconCheck, IconDownload, IconFavorite } from "@/assets";
import { getDownloadPresignedUrl } from "@/api/File";
import { getNote } from "@/api/Note";

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
        <div className="text-center text-gray-500 py-4">
          현재 저장된 파일이 없습니다.
        </div>
      }
      renderItem={(item) => (
        <ListItem
          onClick={() => item.type === "NOTE" && onClickItem(item.id)}
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
              getIcon(item.type)
            )
          }
          children={
            <div className="flex items-center gap-2">
              <div className="truncate" title={item.title}>
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
            </div>
          }
          actions={
            <>
              {item.type === "NOTE" && (
                <>
                  <Button
                    color="secondary"
                    size="small"
                    onClick={() => {
                      /* 수정 로직 */
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => {
                      /* 요약 로직 */
                    }}
                  >
                    요약
                  </Button>
                </>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(item);
                }}
                className="w-[30px] h-[30px] flex items-center justify-center"
              >
                <IconDownload />
              </button>
            </>
          }
        />
      )}
    />
  );
}

export default MainFileList;
