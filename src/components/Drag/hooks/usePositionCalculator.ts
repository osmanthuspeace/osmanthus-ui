import { useCallback, useContext } from "react";
import { getCoordinate } from "../_utils/getCoordinate";
import { calculateIndexByCooridnate } from "../_utils/calculateIndexByCooridnate";
import { GridLayout } from "../../SortableItem/interface";
import SortableProviderContext from "../../SortableProvider/SortableProviderContext";
import { Coordinate } from "../../../type";

export function usePositionCalculator(
  gridLayout: GridLayout,
  unitSize: number
) {
  const context = useContext(SortableProviderContext);

  const calculateNewIndex = useCallback(
    (
      element: HTMLElement,
      containerId: string,
      thisContainerCoordinate: Coordinate
    ) => {
      const { x, y } = getCoordinate(element);
      const { rect, childrenLength } =
        context?.getContainerInfoById(containerId);

      const containerCoordinate = {
        x: rect.left,
        y: rect.top,
      };
      // console.log("x,y", x, y);
      console.log(
        "thisContainerCoordinate",
        containerCoordinate,
        childrenLength
      );

      return calculateIndexByCooridnate(
        x,
        y,
        gridLayout,
        unitSize,
        containerCoordinate,
        childrenLength
      );
    },
    [
      context,
      gridLayout.columns,
      gridLayout.gap,
      gridLayout.padding,
      gridLayout.rows,
      unitSize,
    ]
  );

  return { calculateNewIndex };
}
