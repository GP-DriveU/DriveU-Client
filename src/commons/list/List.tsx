import ListItem from "./ListItem";
import { type Item } from "../../types/Item";

interface ListProps {
  items: Item[];
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  selectable: boolean;
  onClickItem: (id: string) => void;
}

const List: React.FC<ListProps> = ({
  items,
  onToggleSelect,
  onToggleFavorite,
  selectable,
  onClickItem,
}) => {
  return (
    <div className="px-4 py-6 rounded-md">
      {items && items.length > 0 ? (
        items.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            onToggleSelect={onToggleSelect}
            onToggleFavorite={onToggleFavorite}
            selectable={selectable}
            onClickItem={onClickItem}
          />
        ))
      ) : (
        <div className="text-center text-gray-500 py-4">
          현재 저장된 파일이 없습니다.
        </div>
      )}
    </div>
  );
};

export default List;
