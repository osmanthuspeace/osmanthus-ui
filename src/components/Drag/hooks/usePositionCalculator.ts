import { useCallback, useContext } from "react";
import { getCoordinate } from "../_utils/getCoordinate";
import { calculateIndexByCooridnate } from "../_utils/calculateIndexByCooridnate";
import SortableProviderContext from "../../SortableProvider/context/SortableProviderContext";

export function usePositionCalculator(
  unitSize: number,
  thisContainerId: string
) {
  const context = useContext(SortableProviderContext);

  const calculateNewIndex = useCallback(
    (element: HTMLElement, containerId: string) => {
      const { x, y } = getCoordinate(element);
      const { rect, childrenLength, gridLayout } =
        context?.getContainerInfoById(containerId);

      const containerCoordinate = {
        x: rect.left,
        y: rect.top,
      };
      // console.log("x,y", x, y);
      // console.log(
      //   "thisContainerCoordinate",
      //   containerCoordinate,
      //   childrenLength
      // );

      //TODO: 此处的gridLayout应该用target的
      return calculateIndexByCooridnate(
        x,
        y,
        gridLayout,
        unitSize,
        containerCoordinate,
        thisContainerId !== containerId,
        childrenLength
      );
    },
    [context, unitSize]
  );

  return { calculateNewIndex };
}
