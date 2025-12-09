import { DndContext, closestCenter } from "@dnd-kit/core";
import { IconHome, IconStore, IconTrash } from "@/assets";
import { formatFileSize } from "@/utils/itemUtils";
import SidebarItem from "@/commons/layout/sidebar/SideBarItem";
import SidebarGroup from "@/commons/layout/sidebar/SideBarGroup";
import { useSidebar } from "@/hooks/useSidebar";

function Sidebar() {
  const { sensors, handleDragEnd, menuGroups, storage, pathInfo } =
    useSidebar();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <aside className="w-[278px] min-w-[220px] min-h-screen px-10 py-6 bg-primary_light flex flex-col gap-4">
        <div className="flex-shrink-0 mb-6 flex flex-col gap-3">
          <div
            className={`flex flex-row items-center mb-6 ${
              pathInfo.isHome ? "bg-primary text-white" : ""
            }`}
          >
            <IconHome className={`${pathInfo.isHome ? "text-white" : ""}`} />
            <SidebarItem label="전체보기" isActive={pathInfo.isHome} to={"/"} />
          </div>

          {menuGroups.map(
            (group) =>
              group && (
                <SidebarGroup
                  key={group.id}
                  parent={group.id}
                  title={group.title}
                  initialItems={group.items}
                  basePath={group.basePath}
                  currentPath={pathInfo.currentPath}
                />
              )
          )}
        </div>

        <div className="flex-shrink-0 w-full flex flex-col gap-4">
          <div
            className={`flex flex-row items-center ${
              pathInfo.isTrash ? "bg-primary text-white" : ""
            }`}
          >
            <IconTrash className={`${pathInfo.isTrash ? "text-white" : ""}`} />
            <SidebarItem
              label="휴지통"
              isActive={pathInfo.isTrash}
              to={"/trash"}
            />
          </div>

          <div className="flex flex-row items-center">
            <IconStore />
            <SidebarItem label="저장 용량" isActive={pathInfo.isStore} />
          </div>

          <div className="text-xs font-pretendard text-font">
            <div className="h-2.5 w-full bg-[#d9d9d9] overflow-hidden">
              <div
                className="h-2.5 bg-[#61758f] transition-all duration-300 ease-out"
                style={{ width: `${storage.percentage}%` }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between">
              <div>
                <strong className="font-extrabold">
                  {formatFileSize(storage.total)}
                </strong>
                {" 중 "}
                <strong className="font-extrabold">
                  {formatFileSize(storage.used)}
                </strong>
                {" 사용"}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </DndContext>
  );
}

export default Sidebar;
