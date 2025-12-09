import { useState } from "react";
import { SORT_ORDERS, type SortOption, type SortOrder } from "@/types/sort";
import SortMenuButton from "@/commons/sorting/SortMenuButton";

interface SortConfigProps<T extends string> {
  currentSort: SortOption<T>;
  onSortChange: (newSortOption: SortOption<T>) => void;
  fieldOptions: Record<T, string>;
}

function SortConfig<T extends string>({
  currentSort,
  onSortChange,
  fieldOptions,
}: SortConfigProps<T>) {
  const [openMenu, setOpenMenu] = useState<"field" | "order" | null>(null);

  const handleFieldSelect = (field: string) => {
    onSortChange({ ...currentSort, field: field as T });
    setOpenMenu(null);
  };

  const handleOrderSelect = (order: string) => {
    onSortChange({ ...currentSort, order: order as SortOrder });
    setOpenMenu(null);
  };

  return (
    <div className="px-4 py-4 bg-white rounded outline outline-[0.50px] outline-tag-gray inline-flex justify-start items-center gap-4">
      <SortMenuButton
        label={fieldOptions[currentSort.field]}
        isOpen={openMenu === "field"}
        onClick={() => setOpenMenu(openMenu === "field" ? null : "field")}
        options={fieldOptions}
        onSelect={handleFieldSelect}
        selectedValue={currentSort.field}
      />

      <SortMenuButton
        label={SORT_ORDERS[currentSort.order]}
        isOpen={openMenu === "order"}
        onClick={() => setOpenMenu(openMenu === "order" ? null : "order")}
        options={SORT_ORDERS}
        onSelect={handleOrderSelect}
        selectedValue={currentSort.order}
      />
    </div>
  );
}

export default SortConfig;
