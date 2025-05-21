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
  if (width === 0 || height === 0)
    return useMemo(() => {
      return {
        computedGap: 0,
        computedGridTemplateRows: 0,
        containerPaddingX: 0,
        containerPaddingY: 0,
      };
    }, [gridTemplateColumns, height, unitSize, width]);
  return useMemo(() => {
    const gap = Math.max(
      0,
      (width - gridTemplateColumns * unitSize) / (gridTemplateColumns + 1) //(width - gridTemplateColumns * unitSize) / (gridTemplateColumns - 1) 标准盒模型
    );
    //从1开始的rows
    const rows = Math.ceil(childrenLength / gridTemplateColumns);
    const paddingY = Math.max(
      0,
      (height - rows * unitSize - gap * (rows - 1)) / 2
    );
    // console.log("rows", rows, "column", gridTemplateColumns);
    // console.log("gap", gap);
    // console.log("paddingY", paddingY);

    return {
      computedGap: gap,
      computedGridTemplateRows: rows,
      containerPaddingX: gap,
      containerPaddingY: paddingY,
    };
  }, [gridTemplateColumns, height, unitSize, width]);
};
