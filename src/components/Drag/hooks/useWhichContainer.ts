import { useCallback, useContext } from "react";
import CrossContainerContext from "../../CrossContainer/CrossContainerContext";

export const useWhichContainer = () => {
  const context = useContext(CrossContainerContext);

  const inWhichContainer = useCallback(
    (itemX: number, itemY: number) => {
      if (!context?.containerRegister) return null;
      for (const [id, containerRect] of context.containerRegister) {
        if (
          itemX >= containerRect.left &&
          itemX <= containerRect.left + containerRect.width &&
          itemY >= containerRect.top &&
          itemY <= containerRect.top + containerRect.height
        ) {
          return id;
        }
      }
      return null;
    },
    [context?.containerRegister]
  );
  return { inWhichContainer };
};
