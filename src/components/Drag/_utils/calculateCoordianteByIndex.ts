import { Coordinate } from "../../../type";
import { GridLayout } from "../../SortableItem/interface";

//通过index，计算出应该在的坐标（左上角）
export const calculateCoordianteByIndex = (
  index: number,
  gridLayout: GridLayout,
  unitSize: number,
  containerCoordinate: Coordinate
): {
  x: number;
  y: number;
} => {
  //从0开始的row和col
  const targetRow = Math.floor(index / gridLayout.columns);
  const targetCol = index % gridLayout.columns;
  // console.log("targetRow", targetRow, "targetCol", targetCol);
  const targetX =
    targetCol * (unitSize + gridLayout.gap) +
    gridLayout.gap +
    // unitSize / 2 +
    containerCoordinate.x;
  const targetY =
    targetRow * (unitSize + gridLayout.gap) +
    gridLayout.gap +
    // unitSize / 2 +
    containerCoordinate.y;
  return { x: targetX, y: targetY };
};
