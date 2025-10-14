interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyComponent: React.ReactNode;
}

function List<T extends { id: number | string }>({
  items,
  renderItem,
  emptyComponent,
}: ListProps<T>) {
    
  return (
    <div className="px-4 py-6 rounded-md">
      {items && items.length > 0
        ? items.map((item) => <div key={item.id}>{renderItem(item)}</div>)
        : emptyComponent}
    </div>
  );
}

export default List;
