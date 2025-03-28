import { useCallback, useContext } from "react";
import { getCoordinate } from "../_utils/getCoordinate";
import { calculateIndexByCooridnate } from "../_utils/calculate";
import { GridLayout } from "../../Sortable/interface";
import CrossContainerContext from "../../CrossContainer/CrossContainerContext";

export function usePositionCalculator(
  gridLayout: GridLayout,
  unitSize: number
) {
  const { getContainerCoordinateById } = useContext(CrossContainerContext);

  const calculateNewIndex = useCallback(
    (element: HTMLElement, containerId: string) => {
      const { x, y } = getCoordinate(element);
      const { containerX, containerY } =
        getContainerCoordinateById(containerId);
      return calculateIndexByCooridnate(
        x,
        y,
        gridLayout.padding,
        gridLayout.gap,
        unitSize,
        containerX,
        containerY,
        gridLayout.columns,
        gridLayout.rows
      );
    },
    [
      getContainerCoordinateById,
      gridLayout.columns,
      gridLayout.gap,
      gridLayout.padding,
      gridLayout.rows,
      unitSize,
    ]
  );

  return { calculateNewIndex };
}
