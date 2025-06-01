import ListItem, { type Item } from "./ListItem";

interface ListProps {
  items: Item[];
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  selectable: boolean;
}

const List: React.FC<ListProps> = ({
  items,
  onToggleSelect,
  onToggleFavorite,
  selectable,
}) => {
  return (
    <div className="p-4 rounded-md">
      {items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          onToggleSelect={onToggleSelect}
          onToggleFavorite={onToggleFavorite}
          selectable={selectable}
        />
      ))}
    </div>
  );
};

export default List;
