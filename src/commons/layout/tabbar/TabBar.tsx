import React, { useState } from "react";
import TabBarItem from "./TabBarItem";

const TabBar: React.FC = () => {
  const tabs = [
    { title: "필기 내용", colorClass: "bg-secondary", selectedColorClass: "bg-secondary" },
    { title: "AI 요약", colorClass: "bg-primary", selectedColorClass: "bg-primary" },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="w-64 h-[70px] relative flex items-end">
      {tabs.map((tab, index) => (
        <div key={index} className="relative">
          <TabBarItem
            title={tab.title}
            colorClass={tab.colorClass}
            selectedColorClass={tab.selectedColorClass}
            selected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default TabBar;