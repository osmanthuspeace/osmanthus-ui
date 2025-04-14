import { useCallback, useContext } from "react";
import { getCoordinate } from "../_utils/getCoordinate";
import { calculateIndexByCooridnate } from "../_utils/calculateIndexByCooridnate";
import { Coordinate } from "../../../type";
import { GridLayout } from "../../SortableContainer/interface";
import SortableProviderContext from "../../SortableProvider/context/SortableProviderContext";

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
      // console.log(
      //   "thisContainerCoordinate",
      //   containerCoordinate,
      //   childrenLength
      // );

      //TODO：
      //如果是同一个容器，则index不能超过childrenLength
      //如果是不同容器，则index不能超过overContainer的childrenLength+1
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
