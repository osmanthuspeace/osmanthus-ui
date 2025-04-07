import { useCallback, useContext } from "react";
import { getCoordinate } from "../_utils/getCoordinate";
import { calculateIndexByCooridnate } from "../_utils/calculate";
import { GridLayout } from "../../Sortable/interface";
import CrossContainerContext, {
  emptyFn,
} from "../../CrossContainer/CrossContainerContext";
import { Coordinate } from "../../../type";

export function usePositionCalculator(
  gridLayout: GridLayout,
  unitSize: number
) {
  const context = useContext(CrossContainerContext);

  const calculateNewIndex = useCallback(
    (
      element: HTMLElement,
      containerId: string,
      thisContainerCoordinate: Coordinate
    ) => {
      const { x, y } = getCoordinate(element, 1.05);
      const containerCoordinate =
        context?.getContainerCoordinateById !== emptyFn
          ? context?.getContainerCoordinateById(containerId)
          : thisContainerCoordinate;

      return calculateIndexByCooridnate(
        x,
        y,
        gridLayout.padding,
        gridLayout.gap,
        unitSize,
        containerCoordinate.x,
        containerCoordinate.y,
        gridLayout.columns,
        gridLayout.rows
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
