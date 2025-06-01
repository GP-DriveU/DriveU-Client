import React from "react";
import SidebarItem from "./SideBarItem";
import IconAdd from "../../../assets/icon/icon_adddir.svg?react";
interface SidebarGroupProps {
  title: string;
  items: string[];
  basePath: string;
  currentPath: string;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({
  title,
  items,
  basePath,
  currentPath,
}) => (
  <div className="w-full flex flex-col gap-2">
    <div className="flex items-center justify-between py-1">
      <span className="text-xl font-semibold">{title}</span>
      <IconAdd />
    </div>
    <hr className="border-font border-t-0.5" />
    {items.map((item) => {
      const path = `${basePath}/${item}`;
      return (
        <SidebarItem
          key={item}
          label={item}
          to={path}
          isActive={currentPath === path}
        />
      );
    })}
  </div>
);

export default SidebarGroup;
