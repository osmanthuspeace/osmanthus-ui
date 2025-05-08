import { useCallback, useContext } from "react";
import SortableProviderContext from "../../SortableProvider/context/SortableProviderContext";

export const useWhichContainer = () => {
  const context = useContext(SortableProviderContext);

  const getContainerIdByCoordinate = useCallback(
    (itemX: number, itemY: number) => {
      if (!context.containerRegister) {
        console.log("no container register");
        return null;
      }
      for (const [id, containerInfo] of context.containerRegister) {
        const containerRect = containerInfo.rect;

        if (
          itemX >= containerRect.left &&
          itemX <= containerRect.left + containerRect.width &&
          itemY >= containerRect.top &&
          itemY <= containerRect.top + containerRect.height
        ) {
          // console.log("find in id:", id);
          return id;
        }
      }
      return null;
    },
    [context?.containerRegister]
  );
  return getContainerIdByCoordinate ;
};
