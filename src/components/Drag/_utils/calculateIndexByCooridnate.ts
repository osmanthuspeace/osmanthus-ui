
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

  // console.log('max', maxRowIndex, maxColIndex);
  
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
  const index = row * gridCol + col;
  // console.log("index", index);
  return index;
};
