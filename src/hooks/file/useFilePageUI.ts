import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useFilePageUI = () => {
  const location = useLocation();

  const [viewMode, setViewMode] = useState<"gallery" | "list">("list");
  const [isSelectable, setSelectableMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [modalState, setModalState] = useState({
    isOpen: {
      upload: false,
      tag: false,
      link: false,
      loading: false,
      confirm: false,
    },
    confirmType: null as
      | "upload"
      | "generateQuestion"
      | "delete"
      | "link"
      | null,
    pendingFiles: null as FileList | null,
    pendingLinkData: null as { title: string; url: string } | null,
  });

  const modalActions = {
    open: (type: keyof typeof modalState.isOpen) =>
      setModalState((prev) => ({
        ...prev,
        isOpen: { ...prev.isOpen, [type]: true },
      })),
    close: (type: keyof typeof modalState.isOpen) =>
      setModalState((prev) => ({
        ...prev,
        isOpen: { ...prev.isOpen, [type]: false },
      })),
    closeAll: () =>
      setModalState((prev) => ({
        ...prev,
        isOpen: {
          upload: false,
          tag: false,
          link: false,
          loading: false,
          confirm: false,
        },
      })),
    setPendingFiles: (files: FileList | null) =>
      setModalState((prev) => ({ ...prev, pendingFiles: files })),
    setPendingLink: (data: { title: string; url: string } | null) =>
      setModalState((prev) => ({ ...prev, pendingLinkData: data })),
    setConfirmType: (type: any) =>
      setModalState((prev) => ({ ...prev, confirmType: type })),
    setLoading: (loading: boolean) =>
      setModalState((prev) => ({
        ...prev,
        isOpen: { ...prev.isOpen, loading },
      })),
  };

  useEffect(() => {
    if (location.state?.openFab) {
      setIsGenerating(true);
      setSelectableMode(true);
    }
  }, [location.state]);

  return {
    uiState: { viewMode, isSelectable, isGenerating },
    uiActions: { setViewMode, setSelectableMode, setIsGenerating },
    modals: {
      state: modalState,
      actions: modalActions,
      setState: setModalState,
    },
  };
};
