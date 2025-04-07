import { Coordinate } from "../../../type";
import { GridLayout } from "../../Sortable/interface";

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

//通过左上角的坐标，计算出index
export const calculateIndexByCooridnate = (
  x: number,
  y: number,
  padding: number,
  gap: number,
  unitSize: number,
  containerX: number,
  containerY: number,
  gridCol: number,
  gridRow: number
) => {
  const maxRowIndex = gridRow - 1;
  const maxColIndex = gridCol - 1;
  let row = Math.round((y - containerY - padding) / (unitSize + gap));
  row = row < 0 ? 0 : row;
  row = row > maxRowIndex ? maxRowIndex : row;
  let col = Math.round((x - containerX - padding) / (unitSize + gap));
  console.log("x", x, "containerX", containerX, "padding", padding);
  col = col < 0 ? 0 : col;
  col = col > maxColIndex ? maxColIndex : col;
  console.log("row", row, "col", col);
  const index = row * gridCol + col;
  // console.log("index", index);
  return index;
};
