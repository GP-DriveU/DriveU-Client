import { useFilePageActions } from "./useFilePageActions";
import { useFilePageData } from "./useFilePageData";
import { useFilePageUI } from "./useFilePageUI";

export const useFilePageController = () => {
  const data = useFilePageData();
  const { uiState, uiActions, modals } = useFilePageUI();

  const actions = useFilePageActions({
    directoryId: data.directoryId,
    items: data.items,
    setItems: data.setItems,
    modals: modals,
  });

  return {
    data,
    ui: { ...uiState, ...uiActions },
    modals,
    actions,
  };
};
