import { useCallback } from "react";
import { getCoordinate } from "../_utils/getCoordinate";
import { calculateIndexByCooridnate } from "../_utils/calculate";
import { Coordinate } from "../../../type";
import { GridLayout } from "../../Sortable/interface";

export function usePositionCalculator(
  gridLayout: GridLayout,
  unitSize: number,
  containerCoordinate: Coordinate
) {
  const calculateNewIndex = useCallback(
    (element: HTMLElement) => {
      const { x, y } = getCoordinate(element);
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
    [gridLayout, unitSize, containerCoordinate]
  );

  return { calculateNewIndex };
}
