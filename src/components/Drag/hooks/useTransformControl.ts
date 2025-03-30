import { useCallback, useEffect, useState } from "react";
import getInterimTransform from "../_utils/getInterimTransform";
import { AnimationScope, useAnimate } from "motion/react";
import { GridLayout } from "../../Sortable/interface";
import { DraggingState } from "../interface";

export const useTransformControl = (
  thisIndex: number,
  draggingState: DraggingState,
  gridLayout: GridLayout,
  unitSize: number,
  shouldClearTransform: boolean,
  setShouldClearTransform: React.Dispatch<React.SetStateAction<boolean>>,
  final: {
    x: number;
    y: number;
  } | null
): [AnimationScope<HTMLDivElement>, typeof animate] => {
  const [scope, animate] = useAnimate<HTMLDivElement>();

  const [isDragged, setIsDragged] = useState(false);

  //拖拽过程中，实时更新transform
  useEffect(() => {
    if (draggingState.activeIndex === thisIndex && !isDragged) {
      setIsDragged(true);
    }
    if (
      draggingState.activeIndex === null ||
      draggingState.overIndex === null ||
      thisIndex === draggingState.activeIndex
    )
      return;

    try {
      const transform = getInterimTransform(
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
    } catch (e) {
      console.error("error", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingState.overIndex]);

  const clearTransform = useCallback(
    async ({ x, y }: { x: number; y: number }) => {
      await animate(scope.current, { x, y }, { duration: 0 });
    },
    [animate, scope]
  );
  // 在拖拽结束后，每一个组件都要将transform清除
  useEffect(() => {
    if (shouldClearTransform) {
      const isDraggingEnd =
        draggingState.activeIndex === null && draggingState.overIndex === null;

      if (!isDraggingEnd) {
        return;
      }
      console.log("clearTransform", final, isDragged);

      if (final && isDragged) {
        animate(scope.current, final, { duration: 0 });
        animate(scope.current, { x: 0, y: 0 }, { duration: 0.2 });
        return;
      } else {
        animate(scope.current, { x: 0, y: 0 }, { duration: 0 });
        return;
      }

      // // 根据拖拽状态选择动画时长
      // const duration = isDraggingEnd ? 0 : 0;

      // clearTransform().then(() => {
      //   setShouldClearTransform(false);
      // });
      setIsDragged(false);
    }
  }, [
    animate,
    draggingState.activeIndex,
    draggingState.overIndex,
    final,
    isDragged,
    scope,
    setShouldClearTransform,
    shouldClearTransform,
  ]);

  return [scope, animate];
};
