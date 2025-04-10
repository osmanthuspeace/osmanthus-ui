import { useCallback, useContext } from "react";
import SortableProviderContext from "../../SortableProvider/SortableProviderContext";

export const useWhichContainer = () => {
  const context = useContext(SortableProviderContext);

  const inWhichContainer = useCallback(
    (itemX: number, itemY: number) => {
      if (!context.containerRegister) {
        console.log("no container register");
        return context.sourceContainerId || null;
      }
      for (const [id, containerInfo] of context.containerRegister) {
        const containerRect = containerInfo.rect;
        console.log("rect", containerRect);

        if (
          itemX >= containerRect.left &&
          itemX <= containerRect.left + containerRect.width &&
          itemY >= containerRect.top &&
          itemY <= containerRect.top + containerRect.height
        ) {
          console.log("find in id:", id);
          return id;
        }
      }
      return null;
    },
    [context?.containerRegister, context?.sourceContainerId]
  );
  return { inWhichContainer };
};
