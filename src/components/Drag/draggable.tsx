import { motion } from "motion/react";
import { forwardRef, Ref, useCallback, useContext } from "react";
import SortableContext from "../Sortable/context/sortableContext";
import { useRef } from "react";
import { useComposeRef } from "../../hooks/useComposeRef";
import { usePositionCalculator } from "./hooks/usePositionCalculator";
import { useTransformControl } from "./hooks/useTransformControl";
import { ComposedEvent, DragItemProps } from "./interface";
import { useWhichContainer } from "./hooks/useWhichContainer";
import { useThrottle } from "../../hooks/useThrottle";
import CrossContainerContext from "../CrossContainer/CrossContainerContext";
import { flushSync } from "react-dom";

const DraggableInternal = (props: DragItemProps, ref: Ref<HTMLDivElement>) => {
  const { thisIndex, children, style } = props;
  const {
    id,
    onReorder,
    shouldClearTransform,
    setShouldClearTransform,
    unitSize,
    gridLayout,
    draggingState,
    setDraggingState,
    onDragStart,
    onDrag,
    onDragEnd,
  } = useContext(SortableContext);

  const { calculateNewIndex } = usePositionCalculator(gridLayout, unitSize);

  const thisRef = useRef<HTMLDivElement>(null);

  const [scope, animate, setShouldBack] = useTransformControl(
    thisIndex,
    draggingState,
    gridLayout,
    unitSize,
    shouldClearTransform,
    setShouldClearTransform
  );
  const composedRef = useComposeRef(scope, thisRef, ref);

  const { inWhichContainer } = useWhichContainer();

  const { onCross } = useContext(CrossContainerContext);

  //开始拖拽
  const handleDragStart = (e: ComposedEvent) => {
    onDragStart?.(e);
    setShouldBack(true);
    setDraggingState((prev) => ({
      ...prev,
      activeIndex: thisIndex,
    }));
  };
  //拖拽过程中
  const handleOnDrag = useCallback(
    async (e: ComposedEvent) => {
      console.log("handleOnDrag");

      onDrag?.(e);
      //暂时不支持移动端
      if (e instanceof TouchEvent) {
        return;
      }
      const newContainerId = inWhichContainer(e.clientX, e.clientY);
      if (newContainerId === null) {
        await animate(scope.current, { x: 0, y: 0 }, { duration: 0.3 });
        return;
      }
      const newIndex = calculateNewIndex(
        e.target as HTMLElement,
        newContainerId
      );
      setDraggingState((prev) => ({
        ...prev,
        overIndex: newIndex,
      }));
    },
    [
      animate,
      calculateNewIndex,
      inWhichContainer,
      onDrag,
      scope,
      setDraggingState,
    ]
  );

  //结束拖拽
  const handleDragEnd = async (e: ComposedEvent) => {
    onDragEnd?.(e);
    if (!scope.current) return;
    try {
      if (!thisRef.current) return;
      if (e instanceof TouchEvent) {
        return;
      }
      const newContainerId = inWhichContainer(e.clientX, e.clientY);
      // console.log("inThisContainerId", inThisContainerId);
      if (newContainerId === null) {
        animate(scope.current, { x: 0, y: 0 }, { duration: 0.3 });
        return;
      }
      const newIndex = calculateNewIndex(
        e.target as HTMLElement,
        newContainerId
      );

      // console.log(
      //   "[DEBUG]",
      //   "source",
      //   id,
      //   thisIndex,
      //   "target",
      //   newContainerId,
      //   newIndex
      // );

      if (newContainerId !== id) {
        onCross?.(
          { containerId: id, index: thisIndex },
          {
            containerId: newContainerId,
            index: newIndex,
          }
        );
      } else {
        if (newIndex !== thisIndex) {
          onReorder(thisIndex, newIndex);
        } else {
          await animate(scope.current, { x: 0, y: 0 }, { duration: 0.3 });
        }
      }
      // flushSync(() => {
        setShouldClearTransform(true);
        setDraggingState((prev) => ({
          ...prev,
          activeIndex: null,
          overIndex: null,
        }));
      // });

      // await new Promise((resolve) => requestAnimationFrame(resolve));
      // await animate(
      //   scope.current,
      //   { x: 0, y: 0 },
      //   {
      //     duration: 0.3,
      //     // 添加过渡完成后的强制重绘
      //     onComplete: () => {
      //       console.log("动画完成，强制重绘");

      //       if (scope.current) {
      //         scope.current.style.transform = "none";
      //       }
      //     },
      //   }
      // );
    } catch (error) {
      console.error("拖拽结束处理出错:", error);
    }
  };

  //将handleOnDrag函数节流
  const throttledHandleOnDrag = useThrottle(handleOnDrag, 100);
  return (
    <>
      <motion.div
        className="drag-item"
        ref={composedRef}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        whileDrag={{ scale: 1.05, zIndex: 100 }}
        // dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }} //回弹效果
        transition={{ type: "spring", stiffness: 300, damping: 30 }} //速度，减速度
        onDragStart={(e) => handleDragStart(e)}
        onDrag={(e) => throttledHandleOnDrag(e)}
        onDragEnd={(e) => handleDragEnd(e)}
        onDragTransitionEnd={() => {}}
        style={
          {
            width: `${unitSize}px`,
            height: `${unitSize}px`,
            ...style,
          } as React.CSSProperties
        }
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </>
  );
};
const Draggable = forwardRef<HTMLDivElement, DragItemProps>(DraggableInternal);
export { Draggable };
