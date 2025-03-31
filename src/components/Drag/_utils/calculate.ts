//通过index，计算出绝对的中心坐标
export const calculateCenterByIndex = (
  index: number,
  padding: number,
  gap: number,
  itemUnit: number,
  containerX: number,
  containerY: number
) => {
  const centerX = padding + (index + 0.5) * itemUnit + index * gap + containerX;
  const centerY = padding + (index + 0.5) * itemUnit + index * gap + containerY;
  return { centerX, centerY };
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
  let row = Math.round((y - containerY - padding) / (unitSize + gap));
  row = row < 0 ? 0 : row;
  row = row > maxRowIndex ? maxRowIndex : row;
  let col = Math.round((x - containerX - padding) / (unitSize + gap));
  col = col < 0 ? 0 : col;
  col = col > maxColIndex ? maxColIndex : col;
  // console.log("row", row, "col", col);
  const index = row * gridCol + col;
  return index;
};
