import { useCallback, useContext, useEffect } from "react";
import getInterimTransform from "../_utils/getInterimTransform";
import { AnimationScope, useAnimate } from "motion/react";
import { DraggingState } from "../interface";
import { Coordinate } from "../../../type";
import SortableProviderContext from "../../SortableProvider/context/SortableProviderContext";
import LayoutContext from "../../SortableContainer/context/layoutContext";

export const useTransformControl = (
  thisIndex: number,
  thisContainerId: string,
  draggingState: DraggingState,
  duration?: number
): [
  AnimationScope<HTMLDivElement> | null,
  (final: Coordinate | null) => Promise<void>,
  (enableAnimate: boolean) => Promise<void>
] => {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const context = useContext(SortableProviderContext);
  const { unitSize, gridLayout } = useContext(LayoutContext);

  //拖拽过程中，实时更新transform
  const handleInterimTransform = useCallback(async () => {
    if (!scope.current) return;

    const notDragging =
      draggingState.activeIndex === null || draggingState.overIndex === null;

    const isSamePosotion = thisIndex === draggingState.activeIndex;
    const isActiveInThisContainer =
      thisContainerId === draggingState.activeContainerId;
    if (
      notDragging ||
      (isSamePosotion && isActiveInThisContainer) //在被拖拽的元素的容器中，并且index相等时，不参与过渡的transform
    ) {
      return;
    }
    const isCrossContainer =
      draggingState.activeContainerId !== draggingState.overContainerId;

    const isOverInThisContainer =
      thisContainerId === draggingState.overContainerId;

    try {
      const { childrenLength: overChildrenLength } =
        context.getContainerInfoById(draggingState.overContainerId);
      const { childrenLength: activeChildrenLength } =
        context.getContainerInfoById(draggingState.activeContainerId);

      let transform: {
        x: number;
        y: number;
      };
      if (!isCrossContainer) {
        //如果在同一容器中
        if (isActiveInThisContainer) {
          //如果当前容器就是开始拖拽时的容器
          const direction =
            thisIndex > draggingState.activeIndex! ? "right" : "left";
          transform = getInterimTransform(
            thisIndex,
            draggingState.activeIndex!,
            draggingState.overIndex!,
            direction,
            gridLayout,
            unitSize
          );
        } else {
          //如果当前容器不是开始拖拽时的容器，说明被拖拽的元素没有进入这个容器，所以不需要过渡
          transform = {
            x: 0,
            y: 0,
          };
        }
      } else {
        // 如果跨容器了
        if (isActiveInThisContainer) {
          //如果当前容器就是开始拖拽时的容器，因为少了一个元素（元素被拖到其他容器中了），所以要向左移动
          transform = getInterimTransform(
            thisIndex,
            draggingState.activeIndex!,
            activeChildrenLength,
            "right",
            gridLayout,
            unitSize
          );
        } else if (isOverInThisContainer) {
          //如果当前容器是结束拖拽时的容器，因为多了一个元素，所以要向右移动
          transform = getInterimTransform(
            thisIndex,
            overChildrenLength,
            draggingState.overIndex!,
            "left",
            gridLayout,
            unitSize
          );
        } else {
          // 其他容器，与当前被拖拽的元素无关
          transform = {
            x: 0,
            y: 0,
          };
        }
      }
      // console.log(
      //   "handleInterimTransform",
      //   `这是容器${thisContainerId}中的第${thisIndex}个元素`,
      //   ` 正在拖拽 ${draggingState.activeContainerId} 容器中的第 ${draggingState.activeIndex} 个元素`,
      //   ` 过渡到 ${draggingState.overContainerId} 容器的第${draggingState.overIndex}位`,
      //   "过渡动画值",
      //   transform
      // );

      if (!transform) {
        throw new Error("transform is null");
      }
      await animate(scope.current, transform, { duration: duration ?? 0.25 });
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
      if (final) {
        await animate(
          scope.current,
          {
            x: final.x,
            y: final.y,
          },
          { duration: 0.2 }
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
    // console.log("组件位于", thisContainerId, "容器中");
    handleInterimTransform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    draggingState.overIndex,
    draggingState.overContainerId,
    draggingState.direction,
  ]);

  return [scope, handleFinalTransform, handleResetTransform];
};
