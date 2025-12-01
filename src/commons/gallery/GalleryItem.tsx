import { type Item } from "@/types/Item";
import { getIcon } from "@/utils/itemUtils";
import Button from "@/commons/inputs/Button";
import { getDownloadPresignedUrl } from "@/api/File";
import { getNote } from "@/api/Note";
import { IconCheck, IconDownload, IconFavorite } from "@/assets";

interface GalleryItemProps {
  item: Item;
  onToggleSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  selectable: boolean;
  onClickItem: (id: number) => void;
}

function GalleryItem({
  item,
  onToggleSelect,
  onToggleFavorite,
  selectable,
  onClickItem,
}: GalleryItemProps) {
  return (
    <div
      className="px-4 py-4 bg-white border-t border-b border-font flex flex-col items-center font-pretendard space-y-6"
      style={{
        borderTop: "0.5px solid #4B5563",
        borderBottom: "0.5px solid #4B5563",
      }}
      onClick={() => onClickItem(item.id)}
    >
      <div className="w-full relative flex items-center">
        <div className="ml-8 flex-1 text-black text-xl font-normal truncate whitespace-nowrap overflow-hidden">
          {item.title}
        </div>
        <div className="absolute left-0 top-[3px] w-6 h-6 flex items-center justify-center">
          {selectable ? (
            <div
              className="w-5 h-5 min-w-[20px] min-h-[20px] flex items-center bg-primary_light justify-center rounded-sm"
              style={{
                border: "0.5px solid #4B5563",
              }}
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
          )}
        </div>
        <div
          className="w-6 h-6 ml-auto cursor-pointer select-none"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
        >
          <IconFavorite
            className={item.favorite ? "text-danger" : "text-gray-300"}
          />
        </div>
      </div>

      <div className="w-full min-h-[95px] text-font text-base sm:text-lg font-normal whitespace-pre-line">
        {item.description}
      </div>

      <div className="w-full max-w-[200px] ml-auto flex justify-end items-center gap-4">
        {item.type === "NOTE" && (
          <>
            <Button color="secondary" size="small" onClick={() => {}}>
              수정
            </Button>
            <Button color="primary" size="small" onClick={() => {}}>
              요약
            </Button>
          </>
        )}
        <button
          onClick={async (e) => {
            e.stopPropagation();
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
          }}
          className="w-[30px] h-[30px] flex items-center justify-center"
        >
          <IconDownload />
        </button>
      </div>
    </div>
  );
}

export default GalleryItem;
