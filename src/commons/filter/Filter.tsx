interface FilterGroupProps {
  title: string;
  options: Record<string, string>;
  selectedFilters: string[];
  onFilterChange: (newFilters: string[]) => void;
  allKey?: string;
}

function Filter({
  title,
  options,
  selectedFilters,
  onFilterChange,
  allKey = "all",
}: FilterGroupProps) {
  const handleFilterClick = (clickedKey: string) => {
    if (clickedKey === allKey) {
      if (selectedFilters.length === 1 && selectedFilters[0] === allKey) return;
      onFilterChange([allKey]);
      return;
    }

    let newFilters = selectedFilters.filter((key) => key !== allKey);

    if (newFilters.includes(clickedKey)) {
      newFilters = newFilters.filter((key) => key !== clickedKey);
    } else {
      newFilters.push(clickedKey);
    }

    if (newFilters.length === 0) {
      onFilterChange([allKey]);
    } else {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="inline-flex flex-col justify-start items-start gap-4">
      <h2 className="self-stretch text-black text-xl font-normal">
        {title}
      </h2>
      <div className="self-stretch inline-flex justify-start items-start gap-4 flex-wrap">
        {Object.entries(options).map(([key, value]) => {
          const isSelected = selectedFilters.includes(key);
          return (
            <button
              key={key}
              onClick={() => handleFilterClick(key)}
              className={`p-2 rounded-xl text-xl font-normal transition-colors ${
                isSelected
                  ? "bg-primary text-white"
                  : "bg-primary_light text-font hover:bg-slate-300"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Filter;
