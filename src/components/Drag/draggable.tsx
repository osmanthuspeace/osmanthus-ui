import { motion } from "motion/react";
import { forwardRef, Ref, useCallback, useContext, useState } from "react";
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
import { getFinalTransform } from "./_utils/getFinalTransform";
import { getCoordinate } from "./_utils/getCoordinate";
import { Coordinate } from "../../type";

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
  const [final, setFinal] = useState<Coordinate | null>(null);

  const [scope, animate] = useTransformControl(
    thisIndex,
    draggingState,
    gridLayout,
    unitSize,
    shouldClearTransform,
    setShouldClearTransform,
    final
  );
  const composedRef = useComposeRef(scope, thisRef, ref);

  const { inWhichContainer } = useWhichContainer();

  const { onCross, getContainerCoordinateById } = useContext(
    CrossContainerContext
  );

  //开始拖拽
  const handleDragStart = (e: ComposedEvent) => {
    onDragStart?.(e);
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
      const { x, y } = getFinalTransform(
        newIndex,
        getCoordinate(thisRef.current),
        getContainerCoordinateById(newContainerId),
        gridLayout,
        unitSize
      );
      setFinal({ x, y });
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
      setShouldClearTransform(true);

      flushSync(() => {
        console.log("flushSync");
        setDraggingState((prev) => ({
          ...prev,
          activeIndex: null,
          overIndex: null,
        }));
      });
      
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
        style={
          {
            width: `${unitSize}px`,
            height: `${unitSize}px`,
            willChange: "transform",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
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
