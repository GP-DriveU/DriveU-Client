import { useLocation } from "react-router-dom";
import { useDirectoryStore } from "@/store/useDirectoryStore";
import { IconHome, IconStore, IconTrash } from "@/assets";
import SidebarItem from "@/commons/layout/sidebar/SideBarItem";
import SidebarGroup from "@/commons/layout/sidebar/SideBarGroup";

function Sidebar () {
  const location = useLocation();
  const getCurrentDirectories = useDirectoryStore(
    (state) => state.getCurrentDirectories
  );

  const currentDirectories = getCurrentDirectories();

  if (currentDirectories.length === 0) {
    return (
      <aside className="w-[278px] min-w-[220px] min-h-screen px-10 py-6 bg-primary_light flex flex-col gap-4">
        <div className="text-center text-font">학기 정보가 없습니다.</div>
      </aside>
    );
  }

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
          const grouped = currentDirectories.map((dir) => {
            const routeMap: Record<string, { slug: string; emoji: string }> = {
              학업: { slug: "study", emoji: "🏫" },
              과목: { slug: "subject", emoji: "📚" },
              대외활동: { slug: "activity", emoji: "📢" },
            };

            const route = routeMap[dir.name];
            if (!route) return null;

            const items = (dir.children ?? []).map((child) => ({
              name: child.name,
              slug: `${encodeURIComponent(child.name)}-${child.id}`,
            }));

            return (
              <SidebarGroup
                key={dir.id}
                parent={dir.id}
                title={`${route.emoji} ${dir.name}`}
                initialItems={items}
                basePath={`/${route.slug}`}
                currentPath={location.pathname}
              />
            );
          });

          return grouped;
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
