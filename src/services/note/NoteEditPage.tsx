import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconArrowLeft from "../../assets/icon/icon_arrow_left.svg?react";
import TitleSection from "../../commons/section/TitleSection";
import TextSection from "../../commons/section/TextSection";
import MDEditor from "@uiw/react-md-editor";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.min.css";
import Button from "../../commons/inputs/Button";

function NoteEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const title = location.state?.title || "";
  const markdownContent = location.state?.markdownContent || "";
  const [content, setContent] = useState(markdownContent);
  return (
    <div className="w-full flex bg-white flex-col">
      <div className="w-full pl-10 pt-6">
        <IconArrowLeft onClick={() => navigate(-1)} />
      </div>
      <TitleSection title={title} />
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
            // TODO: replace with actual API call
            alert("필기 수정이 완료되었습니다.");
            navigate(-1);
          }}
        >
          필기 수정 완료
        </Button>
      </div>
    </div>
  );
}

export default NoteEditPage;