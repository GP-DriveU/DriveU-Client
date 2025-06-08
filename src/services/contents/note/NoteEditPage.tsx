import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import IconArrowLeft from "../../../assets/icon/icon_arrow_left.svg?react";
import TextSection from "../../../commons/section/TextSection";
import MDEditor from "@uiw/react-md-editor";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.min.css";
import Button from "../../../commons/inputs/Button";
import {
  updateNoteTitle,
  updateNoteTag,
  updateNoteContent,
} from "../../../api/Note";
import { useTagStore } from "../../../store/useTagStore";
import type { TagData } from "../../../types/tag";
import TagItem from "../../../commons/tag/TagItem";

function NoteEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { slug } = useParams<{ slug: string }>();
  const directoryId = Number(slug?.split("-").pop());
  const noteId = Number(id);
  const allTags = useTagStore((state) => state.tags);

  const originalTitle = location.state?.title || "";
  const originalContent = location.state?.markdownContent || "";
  const originalTagId = location.state?.tagId ?? null;

  const [title, setTitle] = useState(originalTitle);
  const [content, setContent] = useState(originalContent);
  const [selectedTag, _setSelectedTag] = useState<TagData | null>(
    allTags.find((t) => t.id === originalTagId) ?? null
  );

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
            placeholder={title}
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
                  onClick={() => _setSelectedTag(null)}
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
                    onClick={() => _setSelectedTag(tag)}
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
              if (!noteId) return;
              const id = Number(noteId);
              if (title !== originalTitle) {
                await updateNoteTitle(id, title);
              }
              if ((originalTagId ?? null) !== (selectedTag?.id ?? null)) {
                await updateNoteTag(
                  id,
                  originalTagId ?? null,
                  selectedTag ? selectedTag.id : null
                );
              }
              if (content !== originalContent) {
                await updateNoteContent(id, content);
              }
              alert("필기 수정이 완료되었습니다.");
              navigate(-1);
            } catch (error) {
              console.error("수정 실패:", error);
              alert("수정에 실패했습니다.");
            }
          }}
        >
          필기 수정 완료
        </Button>
      </div>
    </div>
  );
}

export default NoteEditPage;
