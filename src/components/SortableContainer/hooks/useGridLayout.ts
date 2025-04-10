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
  containerPadding: number;
} => {
  // console.log(
  //   "width",
  //   width,
  //   "height",
  //   height,
  //   "unitSize",
  //   unitSize,
  //   "gridTemplateColumns",
  //   gridTemplateColumns
  // );
  return useMemo(() => {
    const gap = Math.max(
      0,
      (width - gridTemplateColumns * unitSize) / (gridTemplateColumns + 1) //(width - gridTemplateColumns * unitSize) / (gridTemplateColumns - 1) 标准盒模型
    );
    // console.log("gap", gap);
    //从1开始的rows
    const rows = Math.ceil(childrenLength / gridTemplateColumns);
    // console.log("rows", rows, "column", gridTemplateColumns);
    return {
      computedGap: gap,
      computedGridTemplateRows: rows,
      containerPadding: gap,
    };
  }, [gridTemplateColumns, height, unitSize, width]);
};
