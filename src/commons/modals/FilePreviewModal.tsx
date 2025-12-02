import { useEffect, useState } from "react";
import { useFilePreviewStore } from "@/store/useFilePreviewStore";
import { getDownloadPresignedUrl } from "@/api/File";
import { IconDownload, IconX } from "@/assets";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function FilePreviewModal() {
  const { previewItem, closePreview } = useFilePreviewStore();
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const imageExts = ["png", "jpg", "jpeg", "gif", "webp"];
  const pdfExts = ["pdf"];

  useEffect(() => {
    const fetchUrl = async () => {
      if (!previewItem) return;

      const ext = previewItem.extension.toLowerCase();
      if (![...imageExts, ...pdfExts].includes(ext)) return;

      try {
        setLoading(true);
        setError(false);
        setNumPages(null);
        setPageNumber(1);

        const signedUrl = await getDownloadPresignedUrl(previewItem.id);
        setUrl(signedUrl);
      } catch (e) {
        console.error("Preview load failed:", e);
        setError(true);
      } finally {
        if (!pdfExts.includes(ext)) {
          setLoading(false);
        }
      }
    };

    if (previewItem) {
      fetchUrl();
    } else {
      setUrl(null);
    }
  }, [previewItem]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(err: Error) {
    console.error("PDF Load Error:", err);
    setError(true);
    setLoading(false);
  }

  if (!previewItem) return null;

  const ext = previewItem.extension.toLowerCase();
  const isImage = imageExts.includes(ext);
  const isPdf = pdfExts.includes(ext);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closePreview();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-lg shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white z-10 shrink-0">
          <div className="flex flex-col overflow-hidden mr-4">
            <h3 className="text-lg font-semibold truncate text-gray-800">
              {previewItem.title}
            </h3>
            {isPdf && numPages && (
              <span className="text-xs text-gray-500">
                Page {pageNumber} of {numPages}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isPdf && numPages && numPages > 1 && (
              <div className="flex items-center gap-2 mr-4 bg-gray-100 rounded-lg px-2 py-1">
                <button
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber((prev) => prev - 1)}
                  className="px-2 py-1 text-sm disabled:opacity-30 hover:bg-gray-200 rounded"
                >
                  Prev
                </button>
                <span className="text-sm font-medium w-10 text-center">
                  {pageNumber}
                </span>
                <button
                  disabled={pageNumber >= numPages}
                  onClick={() => setPageNumber((prev) => prev + 1)}
                  className="px-2 py-1 text-sm disabled:opacity-30 hover:bg-gray-200 rounded"
                >
                  Next
                </button>
              </div>
            )}

            <button
              onClick={() => url && window.open(url, "_blank")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              title="원본 다운로드"
            >
              <IconDownload className="w-5 h-5" />
            </button>
            <button
              onClick={closePreview}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <IconX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full h-full bg-gray-100 flex items-center justify-center overflow-auto relative p-4">
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/50">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-500 text-sm mt-2">
                문서 로딩 중...
              </span>
            </div>
          )}

          {error && (
            <div className="text-gray-500">파일을 미리볼 수 없습니다.</div>
          )}

          {!error && url && (
            <>
              {isImage && (
                <img
                  src={url}
                  alt={previewItem.title}
                  onLoad={() => setLoading(false)}
                  className="max-w-full max-h-full object-contain shadow-md"
                />
              )}
              {isPdf && (
                <div className="shadow-lg max-h-full">
                  <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                    className="flex justify-center"
                  >
                    <Page
                      pageNumber={pageNumber}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      scale={1.0}
                      className="bg-white"
                    />
                  </Document>
                </div>
              )}
            </>
          )}

          {!isImage && !isPdf && (
            <div className="text-center text-gray-500">
              <p>미리보기를 지원하지 않는 형식입니다.</p>
              <p className="text-sm">({previewItem.extension})</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilePreviewModal;
