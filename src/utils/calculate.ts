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

//通过绝对坐标，计算出index
export const calculateIndexByCooridnate = (
  x: number,
  y: number,
  padding: number,
  gap: number,
  itemUnit: number,
  containerX: number,
  containerY: number,
  column: number
) => {
  const row = Math.floor((y - containerY - padding) / (itemUnit + gap));
  const col = Math.floor((x - containerX - padding) / (itemUnit + gap));
  const index = row * column + col;
  return index;
};
