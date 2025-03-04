import { motion } from "motion/react";
import {
  forwardRef,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { throttle } from "../../utils/throttle";
import SortableContext from "../Sortable/sortableContext";
import { useRef } from "react";
import { useComposeRef } from "../../hooks/useComposeRef";
import { parseTransform } from "./_utils/parseTransform";
import { usePositionCalculator } from "./hooks/usePositionCalculator";
import { useTransformControl } from "./hooks/useTransformControl";
import { ComposedEvent, DragItemProps } from "./interface";

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

  //追踪是否进入过其他的cell
  const [isOuted, setIsOuted] = useState(false);
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
      onDrag?.(e);
      const newIndex = calculateNewIndex(e.target as HTMLElement);

      //检测状态，是否进入了其他的cell
      if (newIndex !== thisIndex) {
        // console.log("enter other cell", newIndex);
        //此时不应该调用onReorder，因为会导致重新渲染，而应该让这个index之后的元素都往前/后移动
        if (newIndex !== draggingState.overIndex) {
          setDraggingState((prev) => ({
            ...prev,
            overIndex: newIndex,
          }));
        }
        setIsOuted(true);
      } else {
        if (isOuted) {
          setDraggingState((prev) => ({
            ...prev,
            overIndex: newIndex,
          }));
        }
        //...
      }
    },
    [
      calculateNewIndex,
      draggingState.overIndex,
      isOuted,
      onDrag,
      setDraggingState,
      thisIndex,
    ]
  );

  //结束拖拽
  const handleDragEnd = async (e: ComposedEvent) => {
    onDragEnd?.(e);
    if (!scope.current) return;
    try {
      if (!thisRef.current) return;
      const [translateX, translateY] = parseTransform(
        thisRef.current.style.transform
      );
      // console.log("translateX, translateY", translateX, translateY);

      if (Math.abs(translateX) > 85 || Math.abs(translateY) > 85) {
        const newIndex = calculateNewIndex(e.target as HTMLElement);

        onReorder(thisIndex, newIndex);
        // 重置样式
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
  useEffect(() => {
    throttledHandleOnDragRef.current = throttle(handleOnDrag, 100);
  }, [handleOnDrag]);
  const throttledHandleOnDragRef = useRef(throttle(handleOnDrag, 100));
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
        onDrag={(e) => throttledHandleOnDragRef.current(e)}
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
