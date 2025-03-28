import { useEffect, useState } from "react";
import getTransform from "../_utils/getTransform";
import { AnimationScope, useAnimate } from "motion/react";
import { GridLayout } from "../../Sortable/interface";
import { DraggingState } from "../interface";

export const useTransformControl = (
  thisIndex: number,
  draggingState: DraggingState,
  gridLayout: GridLayout,
  unitSize: number,
  shouldClearTransform: boolean,
  setShouldClearTransform: React.Dispatch<React.SetStateAction<boolean>>
): [
  AnimationScope<HTMLDivElement>,
  typeof animate,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [shouldBack, setShouldBack] = useState(false);

  //拖拽过程中，实时更新transform
  useEffect(() => {
    if (
      draggingState.activeIndex === null ||
      draggingState.overIndex === null ||
      thisIndex === draggingState.activeIndex
    )
      return;
    try {
      const transform = getTransform(
        thisIndex,
        draggingState,
        gridLayout,
        unitSize
      );
      if (!transform) {
        throw new Error("transform is null");
      }
      requestAnimationFrame(() => {
        animate(scope.current, transform, { duration: 0.3 });
      });
      // animate(scope.current, transform, { duration: 0.3 });
    } catch (e) {
      console.error("error", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingState.overIndex]);

  //在拖拽结束后，每一个组件都要将transform清除
  useEffect(() => {
    if (shouldClearTransform) {
      if (shouldBack) {
        //这里有问题，TODO：通过index计算出transform，再回到0
        animate(scope.current, { x: 0, y: 0 }, { duration: 0 });
        setShouldBack(false);
      } else {
        animate(scope.current, { x: 0, y: 0 }, { duration: 0 });
      }
      setShouldClearTransform(false);
    }
  }, [
    animate,
    scope,
    setShouldBack,
    setShouldClearTransform,
    shouldBack,
    shouldClearTransform,
  ]);
  return [scope, animate, setShouldBack];
};
