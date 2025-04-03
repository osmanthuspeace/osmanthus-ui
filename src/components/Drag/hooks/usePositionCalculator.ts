import { useCallback, useContext } from "react";
import { getCoordinate } from "../_utils/getCoordinate";
import { calculateIndexByCooridnate } from "../_utils/calculate";
import { GridLayout } from "../../Sortable/interface";
import CrossContainerContext from "../../CrossContainer/CrossContainerContext";

export function usePositionCalculator(
  gridLayout: GridLayout,
  unitSize: number
) {
  const context = useContext(CrossContainerContext);
  const calculateNewIndex = useCallback(
    (element: HTMLElement, containerId: string) => {
      const { x, y } = getCoordinate(element, 1.05);
      const containerCoordinate = context?.getContainerCoordinateById?.(
        containerId
      ) || {
        containerX: 0,
        containerY: 0,
      };
      return calculateIndexByCooridnate(
        x,
        y,
        gridLayout.padding,
        gridLayout.gap,
        unitSize,
        containerCoordinate.containerX,
        containerCoordinate.containerY,
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
