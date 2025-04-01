import { motion } from "motion/react";
import {
  forwardRef,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import SortableContext from "../Sortable/context/sortableContext";
import { useRef } from "react";
import { useComposeRef } from "../../hooks/useComposeRef";
import { usePositionCalculator } from "./hooks/usePositionCalculator";
import { useTransformControl } from "./hooks/useTransformControl";
import { ComposedEvent, DragItemProps } from "./interface";
import { useWhichContainer } from "./hooks/useWhichContainer";
import { useThrottle } from "../../hooks/useThrottle";
import CrossContainerContext from "../CrossContainer/CrossContainerContext";
import { getFinalTransform } from "./_utils/getFinalTransform";
import { getCoordinate } from "./_utils/getCoordinate";
import "./draggable.css";
const DraggableInternal = (props: DragItemProps, ref: Ref<HTMLDivElement>) => {
  const { thisIndex, children, style } = props;
  const {
    id,
    onReorder,
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

  const [scope, handleFinalTransform, handleResetTransform] =
    useTransformControl(thisIndex, draggingState, gridLayout, unitSize);
  const composedRef = useComposeRef(scope, thisRef, ref);

  const { inWhichContainer } = useWhichContainer();

  //标识这个index元素是否正在拖拽
  const [isDragged, setIsDragged] = useState(false);

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
      setIsDragged(true);
      onDrag?.(e);

      //暂时不支持移动端
      if (e instanceof TouchEvent) {
        return;
      }
      console.log("e", e.clientX, e.clientY);
      const newContainerId = inWhichContainer(e.clientX, e.clientY);
      if (newContainerId === null) {
        await handleResetTransform(true);
        return;
      }
      const newIndex = calculateNewIndex(
        e.target as HTMLElement,
        newContainerId
      );
      console.log("newIndex", newIndex);

      setDraggingState((prev) => ({
        ...prev,
        overIndex: newIndex,
      }));
    },
    [
      calculateNewIndex,
      handleResetTransform,
      inWhichContainer,
      onDrag,
      setDraggingState,
    ]
  );

  //结束拖拽
  //TODO: 使用flip，先将正在拖拽的元素归位，然后onReorder重排，再使用transform过渡到原位置，再将transform全部清除
  const handleDragEnd = async (e: ComposedEvent) => {
    onDragEnd?.(e);
    try {
      if (!thisRef.current) return;

      if (e instanceof TouchEvent) {
        return;
      }
      const newContainerId = inWhichContainer(e.clientX, e.clientY);
      // console.log("inThisContainerId", inThisContainerId);
      if (newContainerId === null) {
        await handleResetTransform(true);
        return;
      }
      const newIndex = calculateNewIndex(
        e.target as HTMLElement,
        newContainerId
      );
      const finalTransform = getFinalTransform(
        newIndex,
        getCoordinate(thisRef.current),
        getContainerCoordinateById(newContainerId),
        gridLayout,
        unitSize
      );

      console.log("final state", newContainerId, id, newIndex, thisIndex);
      setDraggingState((prev) => ({
        ...prev,
        activeIndex: null,
        overIndex: null,
      }));
      if (newContainerId !== id) {
        // 进入其他容器
        onCross?.(
          { containerId: id, index: thisIndex },
          {
            containerId: newContainerId,
            index: newIndex,
          }
        );
      } else {
        if (newIndex !== thisIndex) {
          //进入同一容器的其他网格
          onReorder(thisIndex, newIndex, draggingState.activeIndex as number);
          await handleFinalTransform(finalTransform);
        } else {
          //回到原网格
          console.log("no change, reset");

          await handleResetTransform(true);
        }
      }
    } catch (error) {
      console.error("拖拽结束处理出错:", error);
    }
  };

  useEffect(() => {
    if (
      draggingState.activeIndex === null &&
      draggingState.overIndex === null &&
      !isDragged
    ) {
      handleResetTransform(false);
    }
  }, [draggingState, handleResetTransform, isDragged]);

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
