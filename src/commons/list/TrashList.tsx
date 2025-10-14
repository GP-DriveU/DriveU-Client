import List from "@/commons/list/List";
import ListItem from "@/commons/list/ListItem";
import Button from "@/commons/inputs/Button";
import { getIcon } from "@/utils/itemUtils";
import type { TrashItem } from "@/types/Item";
import EmptySection from "@/commons/section/EmptySection";

interface TrashListProps {
  items: TrashItem[];
  onRestore: (id: number) => void;
  onDelete: (id: number) => void;
}

function TrashList({ items, onRestore, onDelete }: TrashListProps) {
  return (
    <List
      items={items}
      emptyComponent={
        <div className="w-full h-full flex flex-col items-center justify-center">
          <EmptySection
            title="휴지통이 비어 있음"
            subtitle="휴지통으로 이동된 항목은 30일 후 완전 삭제됩니다."
          />
        </div>
      }
      renderItem={(item) => (
        <ListItem
          leading={getIcon(item.type)}
          children={
            <div className="truncate" title={item.name}>
              {item.name}
            </div>
          }
          actions={
            <div className="w-40 flex flex-row gap-2">
              <Button
                color="secondary"
                size="small"
                onClick={() => {
                  onRestore(item.id);
                }}
              >
                복원
              </Button>
              <Button
                color="primary"
                size="small"
                onClick={() => {
                  onDelete(item.id);
                }}
              >
                삭제
              </Button>
            </div>
          }
        />
      )}
    />
  );
}

export default TrashList;
