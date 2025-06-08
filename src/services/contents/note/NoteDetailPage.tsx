import { useState, useEffect } from "react";
import type { TagData } from "../../../types/tag";
import { useParams } from "react-router-dom";
import { getNote } from "../../../api/Note";
import ProgressModal from "../../../commons/modals/ProgressModal";
import { useNavigate } from "react-router-dom";
import TextSection from "../../../commons/section/TextSection";
import TitleSection from "../../../commons/section/TitleSection";
import TabBar from "../../../commons/layout/tabbar/TabBar";
import IconEdit from "../../../assets/icon/icon_edit.svg?react";
import IconArrowLeft from "../../../assets/icon/icon_arrow_left.svg?react";
import MDEditor from "@uiw/react-md-editor";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.min.css";
import Button from "../../../commons/inputs/Button";
import { useTagStore } from "../../../store/useTagStore";
import TagItem from "../../../commons/tag/TagItem";

function NoteDetailPage() {
  const iconItems = [{ id: "one", icon: <IconEdit /> }];
  const [selectedIconId] = useState<string>();
  const navigate = useNavigate();
  const [tags, setTags] = useState<TagData[]>([]);

  const [title, setTitle] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (!id) return;
        const { title, content, tag } = await getNote(Number(id));
        setTitle(title);
        setMarkdownContent(content);
        const allTags = useTagStore.getState().tags;
        const matchedTag = allTags.find((t) => t.id === Number(tag.tagId));
        if (matchedTag) {
          setTags([matchedTag]);
        }
      } catch (error) {
        console.error("노트 불러오기 실패:", error);
      }
    };

    fetchNote();
  }, [id]);

  useEffect(() => {
    if (selectedIndex === 1) {
      fetchAiSummary();
    }
  }, [selectedIndex]);

  const fetchAiSummary = async () => {
    try {
      // TODO: Replace with real API call from src/api/note.ts or similar
      // const response = await getAiSummary(id);
      // setAiSummary(response.data.content);
      setAiSummary(""); // temporary placeholder
    } catch (error) {
      console.error("AI 요약 불러오기 실패:", error);
    }
  };

  const handleGenerateAiSummary = () => {
    setLoading(true);
    setTimeout(() => {
      setAiSummary("이것은 서버에서 받아온 AI 요약입니다."); // TODO: Replace with API result
      setLoading(false);
    }, 2000); // simulate API delay
  };

  return (
    <div className="w-full flex bg-white flex-col">
      <div className="w-full pl-10 pt-6">
        <IconArrowLeft onClick={() => navigate(-1)} />
      </div>
      <TitleSection
        title={title}
        items={iconItems}
        selectedId={selectedIconId}
        onIconClick={() =>
          navigate(`edit`, {
            state: {
              title,
              markdownContent,
              tagId: tags.length > 0 ? tags[0].id : null,
            },
          })
        }
      />
      <TextSection
        title="태그"
        rightElement={
          tags.length > 0 ? (
            <TagItem title={tags[0].title} color={tags[0].color} />
          ) : (
            <div className="text-font text-md">설정된 태그가 없습니다.</div>
          )
        }
      />
      <div className="ml-auto px-10 pt-4">
        <TabBar
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      </div>
      {selectedIndex === 0 ? (
        <TextSection
          title="내용"
          rightElement={
            <div
              className="prose prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded max-w-none font-pretendard rounded-[10px] outline outline-[0.80px] outline-offset-[-0.80px] outline-font p-4 bg-white"
              data-color-mode="light"
            >
              <div className="wmde-markdown-var [&_.wmde-markdown]:bg-white">
                <MDEditor.Markdown
                  source={markdownContent}
                  components={{
                    code({ children = [], className, ...props }) {
                      const code =
                        props.node && props.node.children
                          ? getCodeString(props.node.children)
                          : children;

                      if (
                        typeof code === "string" &&
                        /^\$\$(.*)\$\$/.test(code)
                      ) {
                        const html = katex.renderToString(
                          code.replace(/^\$\$(.*)\$\$/, "$1"),
                          {
                            throwOnError: false,
                          }
                        );
                        return (
                          <code
                            dangerouslySetInnerHTML={{ __html: html }}
                            style={{ background: "transparent" }}
                          />
                        );
                      }

                      if (
                        typeof code === "string" &&
                        typeof className === "string" &&
                        /^language-katex/.test(className.toLowerCase())
                      ) {
                        const html = katex.renderToString(code, {
                          throwOnError: false,
                        });
                        return (
                          <code
                            dangerouslySetInnerHTML={{ __html: html }}
                            style={{ fontSize: "150%" }}
                          />
                        );
                      }

                      return (
                        <code className={String(className)}>{children}</code>
                      );
                    },
                  }}
                />
              </div>
            </div>
          }
        />
      ) : (
        <TextSection
          title="내용"
          rightElement={
            <>
              <div className="p-4 bg-white outline outline-[0.80px] outline-offset-[-0.80px] outline-font rounded-[10px]">
                {aiSummary ? (
                  <p>{aiSummary}</p>
                ) : (
                  <p className="h-24 flex flex-col font-bold justify-center items-center">
                    아직 생성된 AI 요약이 없습니다
                  </p>
                )}
              </div>
              <div className="w-56 flex justify-end gap-3 mx-auto mt-5">
                <Button
                  size="medium"
                  color="primary"
                  onClick={handleGenerateAiSummary}
                >
                  AI 요약 생성하기
                </Button>
              </div>
            </>
          }
        />
      )}
      <ProgressModal
        title="AI 요약 생성 중"
        description="잠시만 기다려주세요."
        isOpen={loading}
      />
    </div>
  );
}

export default NoteDetailPage;
