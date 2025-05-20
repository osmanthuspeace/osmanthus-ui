import { useMemo } from "react";

export const useGridLayout = (
  width: number,
  height: number,
  unitSize: number,
  gridTemplateColumns: number,
  childrenLength: number
): {
  computedGap: number;
  computedGridTemplateRows: number;
  containerPaddingX: number;
  containerPaddingY: number;
} => {
  // console.log("width", width, "height", height);
  return useMemo(() => {
    const gap = Math.max(
      0,
      (width - gridTemplateColumns * unitSize) / (gridTemplateColumns + 1) //(width - gridTemplateColumns * unitSize) / (gridTemplateColumns - 1) 标准盒模型
    );
    // console.log("gap", gap);
    //从1开始的rows
    const rows = Math.ceil(childrenLength / gridTemplateColumns);
    // console.log("rows", rows, "column", gridTemplateColumns);
    const paddingY = Math.max(
      0,
      (height - rows * unitSize - gap * (rows - 1)) / 2
    );
    return {
      computedGap: gap,
      computedGridTemplateRows: rows,
      containerPaddingX: gap,
      containerPaddingY: paddingY,
    };
  }, [gridTemplateColumns, height, unitSize, width]);
};
