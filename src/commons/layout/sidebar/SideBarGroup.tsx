﻿import React from "react";
import SidebarItem from "./SideBarItem";
import IconAdd from "../../../assets/icon/icon_adddir.svg?react";

interface SidebarGroupProps {
  title: string;
  items: { name: string; slug: string }[];
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
    {items.map(({ name, slug }) => {
      const path = `${basePath}/${slug}`;
      return (
        <SidebarItem
          key={slug}
          label={name}
          to={path}
          isActive={currentPath.startsWith(path)}
        />
      );
    })}
  </div>
);

export default SidebarGroup;
