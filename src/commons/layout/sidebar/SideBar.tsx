import React from "react";
import { useLocation } from "react-router-dom";
import SidebarItem from "./SideBarItem";
import SidebarGroup from "./SideBarGroup";
import { useDirectoryStore } from "../../../store/useDirectoryStore";
import IconHome from "../../../assets/icon/icon_home.svg?react";
import IconTrash from "../../../assets/icon/icon_trash.svg?react";
import IconStore from "../../../assets/icon/icon_store.svg?react";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const getCurrentDirectories = useDirectoryStore(
    (state) => state.getCurrentDirectories
  );
  const currentDirectories = getCurrentDirectories();

  const isHome = location.pathname === "/";
  return (
    <aside className="w-[278px] min-w-[220px] min-h-screen px-10 py-6 bg-primary_light flex flex-col gap-4">
      <div className="flex-shrink-0 mb-6 flex flex-col gap-3">
        <div
          className={`flex flex-row items-center mb-6 ${
            isHome ? "bg-primary text-white" : ""
          }`}
        >
          <IconHome className={`${isHome ? "text-white" : ""}`} />
          <SidebarItem label="전체보기" isActive={isHome} to={"/"} />
        </div>
        {(() => {
          const routeMap: Record<
            string,
            { slug: string; id: number; emoji: string }
          > = {
            학업: { slug: "study", id: 100, emoji: "🏫" },
            과목: { slug: "subject", id: 200, emoji: "📚" },
            대외활동: { slug: "activity", id: 300, emoji: "📢" },
          };
          return Object.entries(routeMap).map(([name, { slug, emoji, id }]) => {
            const group = currentDirectories.find((dir) => dir.id === id);
            if (!group) return null;

            return (
              <SidebarGroup
                key={group.id}
                title={`${emoji} ${name}`}
                items={group.children.map((child) => ({
                  name: child.name,
                  slug: encodeURIComponent(child.name),
                }))}
                basePath={`/${slug}`}
                currentPath={location.pathname}
              />
            );
          });
        })()}
      </div>

      <div className="flex-shrink-0 w-full flex flex-col gap-4">
        <div className="flex flex-row items-center">
          <IconTrash />
          <SidebarItem
            label="휴지통"
            isActive={location.pathname === "/trash"}
          />
        </div>
        <div className="flex flex-row items-center">
          <IconStore />
          <SidebarItem
            label="저장 용량"
            isActive={location.pathname === "/store"}
          />
        </div>
        {/* todo : 저장용량 api 연동 물어봐야 함 */}
        <div className="text-xs font-pretendard text-font">
          <div className="h-2.5 w-full bg-[#d9d9d9] overflow-hidden">
            <div className="h-2.5 bg-[#61758f]" style={{ width: "55%" }}></div>
          </div>
          <div className="mt-1">
            <strong className="font-extrabold">2GB</strong> 중{" "}
            <strong className="font-extrabold">1.1GB</strong> 사용
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
