import { Direction } from "../../../type";

//在拖动时，根据当前元素的索引和正在拖动元素的索引，计算当前元素的位移
const getInterimTransform = (
  thisIndex: number,
  originIndex: number,
  targetIndex: number,
  direction: Direction,
  gridLayout: {
    columns: number;
    gap: number;
  },
  unitSize: number
) => {
  let transform = { x: 0, y: 0 };

  if (
    originIndex === null ||
    targetIndex === null
    // thisIndex === originIndex
  ) {
    return transform;
  }

  //当拖动元素相对于一开始向右移动时
  if (direction === "right") {
    //如果当前元素在拖动元素的路径上，则需要移动
    if (thisIndex > originIndex && thisIndex <= targetIndex) {
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
  else if (direction === "left") {
    if (thisIndex >= targetIndex && thisIndex <= originIndex) {
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
  // console.log(
  //   "thisContainerId",
  //   thisContainerId,
  //   "thisIndex",
  //   thisIndex,
  //   "activeIndex",
  //   draggingState.activeIndex,
  //   "overIndex",
  //   draggingState.overIndex,
  //   "transform",
  //   transform
  // );

  return transform;
};
export default getInterimTransform;
