import { GridLayout } from "../../Sortable/interface";

//通过index，计算出应该在的左上角坐标
export const calculateCoordianteByIndex = (
  index: number,
  gridLayout: GridLayout,
  unitSize: number,
  containerCoordinate: {
    containerX: number;
    containerY: number;
  }
): {
  x: number;
  y: number;
} => {
  const targetRow = Math.floor(index / gridLayout.columns);
  const targetCol = index % gridLayout.columns;
  const targetX =
    targetCol * (unitSize + gridLayout.gap) +
    gridLayout.gap +
    unitSize / 2 +
    containerCoordinate.containerX;
  const targetY =
    targetRow * (unitSize + gridLayout.gap) +
    gridLayout.gap +
    unitSize / 2 +
    containerCoordinate.containerY;
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
  // const centerOffset = unitSize / 2;
  const maxRowIndex = gridRow - 1;
  const maxColIndex = gridCol - 1;
  console.log("maxRowIndex", maxRowIndex, "maxColIndex", maxColIndex);
  let row = Math.round((y - containerY - padding) / (unitSize + gap));
  row = row < 0 ? 0 : row;
  row = row > maxRowIndex ? maxRowIndex : row;
  let col = Math.round((x - containerX - padding) / (unitSize + gap));
  col = col < 0 ? 0 : col;
  col = col > maxColIndex ? maxColIndex : col;
  console.log("row", row, "col", col);
  const index = row * gridCol + col;
  return index;
};
