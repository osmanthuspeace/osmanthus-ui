import { useMemo } from "react";

export const useGridLayout = (
  width: number,
  height: number,
  unitSize: number,
  gridTemplateColumns: number
): {
  computedGap: number;
  computedGridTemplateRows: number;
  containerPadding: number;
} => {
  return useMemo(() => {
    const gap = Math.max(
      0,
      //标准盒模型
      (width - gridTemplateColumns * unitSize) / (gridTemplateColumns - 1)
    );
    // console.log("gap", gap);
    const rows = Math.ceil((height + gap) / (unitSize + gap));
    // console.log("rows", rows);
    return {
      computedGap: gap,
      computedGridTemplateRows: rows,
      containerPadding: gap,
    };
  }, [gridTemplateColumns, height, unitSize, width]);
};
