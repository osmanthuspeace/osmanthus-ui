import { useCallback, useContext } from "react";
import CrossContainerContext from "../../CrossContainer/CrossContainerContext";

export const useWhichContainer = () => {
  const { containerRegister } = useContext(CrossContainerContext);

  const inWhichContainer = useCallback(
    (itemX: number, itemY: number) => {
      for (const [id, containerRect] of containerRegister) {
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
    [containerRegister]
  );
  return { inWhichContainer };
};
