import { useNavigate } from "react-router-dom";
import { updateQuestionTitle } from "@/api/Question";
import type { GalleryQuestionItemProps } from "@/commons/gallery/GalleryQuestionItem";
import GalleryQuestionItem from "@/commons/gallery/GalleryQuestionItem";
interface GalleryQuestionGridProps {
  items: GalleryQuestionItemProps[];
  onRefresh?: () => void;
}

function GalleryQuestion({ items, onRefresh }: GalleryQuestionGridProps) {
  const navigate = useNavigate();

  const handleRename = async (id: string, newTitle: string) => {
    try {
      const questionId = Number(id);
      if (isNaN(questionId)) {
        console.error("Invalid question ID");
        return;
      }

      await updateQuestionTitle(questionId, newTitle);

      alert("제목이 수정되었습니다.");

      if (onRefresh) {
        onRefresh();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("제목 수정 실패:", error);
      alert("제목 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
      {items && items.length > 0 ? (
        items.map((item) => (
          <GalleryQuestionItem
            key={item.id}
            id={item.id}
            version={item.version}
            title={item.title}
            date={item.date}
            onClick={() => navigate(`/question/${item.id}`)}
            onRename={handleRename}
          />
        ))
      ) : (
        <div className="col-span-full w-full flex justify-center items-center py-3">
          <p className="text-gray-500 text-base">
            현재 저장된 파일이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}

export default GalleryQuestion;
