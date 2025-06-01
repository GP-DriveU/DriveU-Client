import React from "react";
import { Link } from "react-router-dom";

interface SidebarItemProps {
  label: string;
  isActive?: boolean;
  to?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  isActive,
  to = "#",
}) => (
  <Link
    to={to}
    className={`w-full h-8 px-4 flex items-center gap-2 rounded-sm text-xl font-normal font-pretendard ${
      isActive ? "bg-primary text-white" : "bg-primary-light text-font"
    }`}
  >
    {label}
  </Link>
);

export default SidebarItem;
