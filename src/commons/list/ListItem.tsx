import React from "react";

interface ListItemProps {
  leading?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
}

function ListItem({ leading, children, actions, onClick }: ListItemProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2 bg-white shadow-sm mb-2"
      style={{
        borderTop: "0.5px solid #4B5563",
        borderBottom: "0.5px solid #4B5563",
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {leading}
        <div className="w-48 font-medium flex flex-col truncate">
          {children}
        </div>
      </div>
      <div className="flex gap-2 min-w-[200px] justify-end">{actions}</div>
    </div>
  );
}

export default ListItem;
