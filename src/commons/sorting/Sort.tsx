﻿import { useState } from "react";
import SortConfig from "@/commons/sorting/SortConfig";
import { SORT_FIELDS, SORT_ORDERS, type SortOption } from "@/types/sort";
import { IconChevronDown, IconChevronUp } from "@/assets";

interface SortProps {
  sortOption: SortOption;
  onSortChange: (newSortOption: SortOption) => void;
}

function Sort({ sortOption, onSortChange }: SortProps) {

  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  const currentSortText = `${SORT_FIELDS[sortOption.field]} : ${
    SORT_ORDERS[sortOption.order]
  }`;

  const toggleConfig = () => {
    setIsConfigOpen((prev) => !prev);
  };

  return (
    <div className="inline-flex flex-col justify-start items-start gap-4">
      <h2 className="self-stretch text-black text-xl font-normal">정렬</h2>

      <div
        onClick={toggleConfig}
        className="pl-4 pr-4 py-2 bg-primary_light rounded-[20px] inline-flex justify-start items-center gap-1 cursor-pointer"
      >
        <div className="text-center text-[#223a58] text-base font-normal">
          {currentSortText}
        </div>
        <button className="flex items-center justify-center text-primary">
          {isConfigOpen ? (
            <IconChevronUp className="w-6 h-6" />
          ) : (
            <IconChevronDown className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className={!isConfigOpen ? "invisible" : ""}>
        <SortConfig currentSort={sortOption} onSortChange={onSortChange} />
      </div>
    </div>
  );
};

export default Sort;
