import TextSection from "../../commons/section/TextSection";
import IconEdit from "../../assets/icon/icon_edit.svg?react";
import IconArrowLeft from "../../assets/icon/icon_arrow_left.svg?react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Tag from "../../commons/tag/Tag";
import TitleSection from "../../commons/section/TitleSection";
import { useNavigate } from "react-router-dom";
import TabBar from "../../commons/layout/tabbar/TabBar";

function NoteDetailPage() {
  const iconItems = [{ id: "one", icon: <IconEdit /> }];
  const [selectedIconId, setSelectedIconId] = useState<string>();
  const navigate = useNavigate();
  const dummyTags = [
    { title: "객지프", color: "" },
  ];

  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    const dummyMarkdown = `
# 객체지향프로그래밍 요약

## 개념 요약

**클래스**는 객체를 생성하기 위한 설계도이며, **객체**는 클래스의 인스턴스입니다.

### 주요 특징

1. **캡슐화 (Encapsulation)**
   - 내부 구현을 숨기고 인터페이스만 공개합니다.

2. **상속 (Inheritance)**
   - 기존 클래스를 확장하여 새로운 클래스를 생성합니다.

3. **다형성 (Polymorphism)**
   - 동일한 인터페이스로 다양한 동작을 구현합니다.

---

> 💡 **참고**: 상속을 사용할 때는 의존성 관계를 주의해야 합니다.

\`\`\`ts
class Animal {
  speak() {
    console.log("Animal sound");
  }
}

class Dog extends Animal {
  speak() {
    console.log("Bark!");
  }
}
\`\`\`

| 개념 | 설명 |
|------|------|
| 클래스 | 객체를 만들기 위한 청사진 |
| 객체 | 클래스로부터 생성된 인스턴스 |

- [x] 상속 예제 확인
- [ ] 추상 클래스 예제 작성 필요

_끝._
    `;
    setMarkdownContent(dummyMarkdown);
  }, []);

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
      <div className="ml-auto px-10 pt-4">
        <TabBar />
      </div>
      <TextSection
        title="내용"
        rightElement={
          <div className="prose max-w-none font-pretendard rounded-[10px] outline outline-[0.80px] outline-offset-[-0.80px] outline-font p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownContent}
            </ReactMarkdown>
          </div>
        }
      />
    </div>
  );
}

export default NoteDetailPage;
