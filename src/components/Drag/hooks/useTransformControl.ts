import { useCallback, useEffect } from "react";
import getInterimTransform from "../_utils/getInterimTransform";
import { AnimationScope, useAnimate } from "motion/react";
import { DraggingState } from "../interface";
import { Coordinate } from "../../../type";
import { GridLayout } from "../../SortableContainer/interface";

export const useTransformControl = (
  thisIndex: number,
  thisContainerId: string,
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
      thisIndex === draggingState.activeIndex || //正在被拖拽的元素不参与过渡的transform
      thisContainerId !== draggingState.overContainerId //如果不是同一个容器，则不参与过渡的transform
    )
      return;

    const crossContainer =
      draggingState.activeContainerId !== draggingState.overContainerId;

    // console.log(
    //   "handleInterimTransform",
    //   thisIndex,
    //   thisContainerId,
    //   draggingState.overContainerId
    // );
    try {
      const transform = crossContainer
        ? getInterimTransform(
            thisIndex,
            draggingState.activeIndex,
            draggingState.overIndex,
            draggingState.direction,
            gridLayout,
            unitSize
          )
        : getInterimTransform(
            thisIndex,
            draggingState.activeIndex,
            draggingState.overIndex,
            draggingState.overIndex > draggingState.activeIndex
              ? "right"
              : "left",
            gridLayout,
            unitSize
          );

      if (!transform) {
        throw new Error("transform is null");
      }
      await animate(scope.current, transform, { duration: 0.25 });
    } catch (e) {
      console.error("error", e);
    }
  }, [
    animate,
    draggingState,
    gridLayout,
    scope,
    thisIndex,
    thisContainerId,
    unitSize,
  ]);

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
    console.log("调用useTransformControl", thisContainerId);

    handleInterimTransform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    draggingState.overIndex,
    draggingState.overContainerId,
    draggingState.direction,
  ]);

  return [scope, handleFinalTransform, handleResetTransform];
};
