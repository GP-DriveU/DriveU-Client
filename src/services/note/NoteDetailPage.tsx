import TextSection from "../../commons/section/TextSection";
import IconEdit from "../../assets/icon/icon_edit.svg?react";
import IconArrowLeft from "../../assets/icon/icon_arrow_left.svg?react";
import { useState } from "react";
import Tag from "../../commons/tag/Tag";
import TitleSection from "../../commons/section/TitleSection";
import { useNavigate } from "react-router-dom";

function NoteDetailPage() {
  const iconItems = [{ id: "one", icon: <IconEdit /> }];
  const [selectedIconId, setSelectedIconId] = useState<string>();
  const navigate = useNavigate();
  const dummyTags = [
    { title: "객지프", color: "" },
    { title: "동적할당", color: "" },
    { title: "메모리", color: "" },
  ];

  return (
    <div className="w-full flex bg-white flex-col">
      <div className="w-full pl-10 pt-6">
        <IconArrowLeft onClick={() => navigate(-1)} />
      </div>
      <TitleSection
        title="객체지향프로그래밍 1주차"
        items={iconItems}
        selectedId={selectedIconId}
        onIconClick={(id) => {
          setSelectedIconId(id);
        }}
      />
      <TextSection
        title="태그"
        rightElement={<Tag tags={dummyTags} onSave={() => {}} />}
      />
    </div>
  );
}

export default NoteDetailPage;
