﻿import { useState } from "react";
import { createNote } from "../../../api/Note";
import { useNavigate, useParams } from "react-router-dom";
import IconArrowLeft from "../../../assets/icon/icon_arrow_left.svg?react";
import TextSection from "../../../commons/section/TextSection";
import MDEditor from "@uiw/react-md-editor";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.min.css";
import Button from "../../../commons/inputs/Button";
import { useTagStore } from "../../../store/useTagStore";
import TagItem from "../../../commons/tag/TagItem";
import type { TagData } from "../../../types/tag";

function NoteWritePage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const directoryId = Number(slug?.split("-").pop());
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const allTags = useTagStore((state) => state.tags);
  const [selectedTag, setSelectedTag] = useState<TagData | null>(null);

  return (
    <div className="w-full flex bg-white flex-col">
      <div className="w-full pl-10 pt-6 pb-10">
        <IconArrowLeft onClick={() => navigate(-1)} />
      </div>
      <TextSection
        title="제목"
        rightElement={
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border bg-[#ffffff] rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="제목을 입력하세요"
          />
        }
      />
      <TextSection
        title="태그"
        rightElement={
          <div className="flex flex-col gap-2">
            {selectedTag ? (
              <div className="flex justify-between items-center gap-2">
                <TagItem title={selectedTag.title} color={selectedTag.color} />
                <button
                  className="text-sm text-red-500 underline"
                  onClick={() => setSelectedTag(null)}
                >
                  태그 제거
                </button>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">선택된 태그 없음</div>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              {allTags
                .filter(
                  (t) => t.id !== directoryId && t.parentDirectoryId !== 50
                )
                .map((tag) => (
                  <div
                    key={tag.id}
                    onClick={() => setSelectedTag(tag)}
                    className="cursor-pointer"
                  >
                    <TagItem title={tag.title} color={tag.color} />
                  </div>
                ))}
            </div>
          </div>
        }
      />
      <TextSection
        title="내용"
        rightElement={
          <div className="w-full" data-color-mode="light">
            <MDEditor
              value={content}
              onChange={(val = "") => setContent(val)}
              height="500"
              preview="live"
              previewOptions={{
                components: {
                  code: ({ children = [], className, ...props }) => {
                    if (
                      typeof children === "string" &&
                      /^\$\$(.*)\$\$/.test(children)
                    ) {
                      const html = katex.renderToString(
                        children.replace(/^\$\$(.*)\$\$/, "$1"),
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
                    const code =
                      props.node && props.node.children
                        ? getCodeString(props.node.children)
                        : children;
                    if (
                      typeof code === "string" &&
                      typeof className === "string" &&
                      /^language-katex/.test(className.toLocaleLowerCase())
                    ) {
                      const html = katex.renderToString(code, {
                        throwOnError: false,
                      });
                      return (
                        <code
                          style={{ fontSize: "150%" }}
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      );
                    }
                    return (
                      <code className={String(className)}>{children}</code>
                    );
                  },
                },
              }}
            />
          </div>
        }
      />
      <div className="w-48 flex mx-auto items-center py-12">
        <Button
          size="medium"
          color="primary"
          onClick={async () => {
            try {
              await createNote(directoryId, {
                title,
                content,
                tagId: selectedTag?.id ?? null,
              });
              alert("필기 노트 작성이 완료되었습니다.");
              navigate(-1);
            } catch (error) {
              console.error("노트 생성 실패:", error);
              alert("노트 생성에 실패했습니다.");
            }
          }}
        >
          작성 완료
        </Button>
      </div>
    </div>
  );
}

export default NoteWritePage;
