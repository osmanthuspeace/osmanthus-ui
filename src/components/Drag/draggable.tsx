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

const DraggableInternal = (props: DragItemProps, ref: Ref<HTMLDivElement>) => {
  const { thisIndex, children, style } = props;
  const {
    onReorder,
    shouldClearTransform,
    setShouldClearTransform,
    containerCoordinate,
    unitSize,
    gridLayout,
    draggingState,
    setDraggingState,
    onDragStart,
    onDrag,
    onDragEnd,
  } = useContext(SortableContext);

  const { calculateNewIndex } = usePositionCalculator(
    gridLayout,
    unitSize,
    containerCoordinate
  );

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
    (e: ComposedEvent) => {
      console.log("handleOnDrag");

      onDrag?.(e);
      const newIndex = calculateNewIndex(e.target as HTMLElement);
      setDraggingState((prev) => ({
        ...prev,
        overIndex: newIndex,
      }));

      //暂时不支持移动端
      if (e instanceof TouchEvent) {
        return;
      }
      const inThisContainerId = inWhichContainer(e.clientX, e.clientY);
      // console.log("inThisContainerId", inThisContainerId);
    },
    [calculateNewIndex, inWhichContainer, onDrag, setDraggingState]
  );

  //结束拖拽
  const handleDragEnd = async (e: ComposedEvent) => {
    onDragEnd?.(e);
    if (!scope.current) return;
    try {
      if (!thisRef.current) return;
      const newIndex = calculateNewIndex(e.target as HTMLElement);

      if (newIndex !== thisIndex) {
        onReorder(thisIndex, newIndex);
      } else {
        await animate(scope.current, { x: 0, y: 0 }, { duration: 0.3 });
      }

      setShouldClearTransform(true);
      setDraggingState((prev) => ({
        ...prev,
        activeIndex: null,
        overIndex: null,
      }));
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
