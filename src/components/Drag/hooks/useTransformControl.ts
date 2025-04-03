import { useCallback, useEffect, useState } from "react";
import getInterimTransform from "../_utils/getInterimTransform";
import { AnimationScope, useAnimate } from "motion/react";
import { GridLayout } from "../../Sortable/interface";
import { DraggingState } from "../interface";
import { Coordinate } from "../../../type";

export const useTransformControl = (
  thisIndex: number,
  draggingState: DraggingState,
  gridLayout: GridLayout,
  unitSize: number
): [
  AnimationScope<HTMLDivElement> | null,
  (final: Coordinate | null) => Promise<void>,
  (enableAnimate: boolean) => Promise<void>
] => {
  const [scope, animate] = useAnimate<HTMLDivElement>();

  //拖拽过程中，实时更新transform
  const handleInterimTransform = useCallback(async () => {
    if (!scope.current) return;

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
      await animate(scope.current, transform, { duration: 0.3 });
    } catch (e) {
      console.error("error", e);
    }
  }, [animate, draggingState, gridLayout, scope, thisIndex, unitSize]);

  const handleFinalTransform = useCallback(
    async (final: Coordinate | null) => {
      if (!scope.current) return;

      console.log("final", final);

      if (final) {
        await animate(
          scope.current,
          {
            x: final.x,
            y: final.y,
          },
          { duration: 0.3 }
        );
        return;
      } else {
        await animate(scope.current, { x: 0, y: 0 }, { duration: 0 });
        return;
      }
    },
    [animate, scope]
  );

  // 在拖拽结束后，每一个组件都要将transform清除
  const handleResetTransform = useCallback(
    async (enableAnimate: boolean) => {
      if (!scope.current) return;
      await animate(
        scope.current,
        { x: 0, y: 0 },
        { duration: enableAnimate ? 0.3 : 0 }
      );
    },
    [animate, scope]
  );

  useEffect(() => {
    handleInterimTransform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingState.overIndex]);

  return [scope, handleFinalTransform, handleResetTransform];
};
