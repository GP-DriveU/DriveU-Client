import { type Item } from "@/types/Item";
import { getIcon } from "@/utils/itemUtils";
import { getDownloadPresignedUrl } from "@/api/File";
import { getNote } from "@/api/Note";
import { IconCheck, IconDownload, IconFavorite } from "@/assets";
import { useFilePreviewStore } from "@/store/useFilePreviewStore";

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
  const { openPreview } = useFilePreviewStore();

  const canPreview =
    item.type === "FILE" &&
    ["png", "jpg", "jpeg", "gif", "webp", "pdf"].includes(
      item.extension?.toLowerCase()
    );

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openPreview(item);
  };

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
              className="w-5 h-5 min-w-[20px] min-h-[20px] flex items-center bg-primary_light justify-center rounded-sm cursor-pointer"
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
            getIcon(item.type, item.iconType)
          )}
        </div>
        <div
          className="w-6 h-6 ml-auto cursor-pointer select-none pl-2" // pl-2 추가하여 타이틀과 간격 확보
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

      <div className="w-full flex justify-between items-center">
        {canPreview && (
          <button
            onClick={handlePreviewClick}
            className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 whitespace-nowrap shrink-0 transition-colors"
          >
            미리보기
          </button>
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
          className="w-full flex justify-end"
        >
          <IconDownload className="w-[30px] h-[30px]" />
        </button>
      </div>
    </div>
  );
}

export default GalleryItem;
