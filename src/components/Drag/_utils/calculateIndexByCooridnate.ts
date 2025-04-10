import { Coordinate } from "../../../type";
import { GridLayout } from "../../SortableItem/interface";

//通过左上角的坐标，计算出index
export const calculateIndexByCooridnate = (
  x: number,
  y: number,
  gridLayout: GridLayout,
  unitSize: number,
  containerCoordinate: Coordinate,
  childrenLength: number
) => {
  const { gap, padding } = gridLayout;
  const { x: containerX, y: containerY } = containerCoordinate;
  const { columns: gridCol, rows: gridRow } = gridLayout;

  const maxRowIndex = gridRow - 1;
  const maxColIndex = gridCol - 1;

  console.log('max', maxRowIndex, maxColIndex);

  let row = Math.round((y - containerY - padding) / (unitSize + gap));
  row = row < 0 ? 0 : row;
  row = row > maxRowIndex ? maxRowIndex : row;

  let col = Math.round((x - containerX - padding) / (unitSize + gap));
  col = col < 0 ? 0 : col;
  col = col > maxColIndex ? maxColIndex : col;

  // console.log(
  //   "x",
  //   x,
  //   "containerX",
  //   containerX,
  //   "y",
  //   y,
  //   "containerY",
  //   containerY,
  //   "padding",
  //   padding
  // );
  // console.log("row", row, "col", col);
  let index = row * gridCol + col;
  console.log("origin index", index);
  index = index < 0 ? 0 : index;
  index = index > childrenLength - 1 ? childrenLength - 1 : index;
  console.log("index", index);
  return index;
};
