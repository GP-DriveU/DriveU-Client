import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SidebarItem from './SideBarItem';

interface SortableItemProps {
  id: string;
  label: string;
  to: string;
  isActive: boolean;
}

export function SortableItem(props: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SidebarItem
        label={props.label}
        to={props.to}
        isActive={props.isActive}
      />
    </div>
  );
}
