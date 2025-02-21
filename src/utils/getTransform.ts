//在拖动时，根据当前元素的索引和正在拖动元素的索引，计算当前元素的位移
const getTransform = (
  thisIndex: number,
  draggingState: {
    activeIndex: number | null;
    overIndex: number | null;
  },
  gridLayout: {
    columns: number;
    gap: number;
  },
  unitSize: number
) => {
  let transform = { x: 0, y: 0 };

  if (
    draggingState.activeIndex === null ||
    draggingState.overIndex === null ||
    thisIndex === draggingState.activeIndex
  )
    return { x: 0, y: 0 };

  //当拖动元素向右移动时
  if (draggingState.overIndex > draggingState.activeIndex) {
    //如果当前元素在拖动元素的路径上，则需要移动
    if (
      thisIndex > draggingState.activeIndex &&
      thisIndex <= draggingState.overIndex
    ) {
      if (thisIndex % gridLayout.columns === 0) {
        //说明元素在最左边，需要移动到上一行的最右边
        transform = {
          x:
            (gridLayout.columns - 1) * unitSize +
            (gridLayout.columns - 1) * gridLayout.gap,
          y: -unitSize - gridLayout.gap,
        };
      } else {
        transform = {
          x: -unitSize - gridLayout.gap,
          y: 0,
        };
      }
    }
  }

  //当拖动元素向左移动时
  if (draggingState.overIndex < draggingState.activeIndex) {
    if (
      thisIndex >= draggingState.overIndex &&
      thisIndex < draggingState.activeIndex
    ) {
      if (thisIndex % gridLayout.columns === gridLayout.columns - 1) {
        transform = {
          x: -(
            (gridLayout.columns - 1) * unitSize +
            (gridLayout.columns - 1) * gridLayout.gap
          ),
          y: unitSize + gridLayout.gap,
        };
      } else {
        transform = {
          x: unitSize + gridLayout.gap,
          y: 0,
        };
      }
    }
  }
  // console.log("transform", thisIndex, transform);
  return transform;
};
export default getTransform;
