import { motion } from "motion/react";
import { forwardRef, Ref, useCallback, useContext, useEffect } from "react";
import SortableContext from "../SortableContext/sortableContext";
import { useRef } from "react";
import { useComposeRef } from "../../hooks/useComposeRef";
import { usePositionCalculator } from "./hooks/usePositionCalculator";
import { useTransformControl } from "./hooks/useTransformControl";
import { ComposedEvent, DragItemProps } from "./interface";
import { useWhichContainer } from "./hooks/useWhichContainer";
import { useThrottle } from "../../hooks/useThrottle";
import SortableProviderContext from "../SortableProvider/SortableProviderContext";
import { getFinalTransform } from "./_utils/getFinalTransform";
import "./draggable.css";
import { eventBus } from "./_utils/eventBus";
import { noop } from "../../utils/noop";
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
    containerCoordinate,
  } = useContext(SortableContext);

  const { calculateNewIndex } = usePositionCalculator(gridLayout, unitSize);

  const thisRef = useRef<HTMLDivElement>(null);

  const [scope, handleFinalTransform, handleResetTransform] =
    useTransformControl(thisIndex, draggingState, gridLayout, unitSize);
  const composedRef = useComposeRef(scope, thisRef, ref);

  const { inWhichContainer } = useWhichContainer();

  const {
    onCross,
    getContainerInfoById,
    sourceContainerId,
    setSourceContainerId,
  } = useContext(SortableProviderContext) || {};

  const enableCross = onCross !== noop;

  useEffect(() => {
    eventBus.subscribe(
      "resetTransform",
      async () => await handleResetTransform(false)
    );
    return () => {
      eventBus.unsubscribe("resetTransform");
    };
  }, [handleResetTransform]);

  //开始拖拽
  const handleDragStart = (e: ComposedEvent) => {
    console.log("handleDragStart");

    onDragStart?.(e);
    setDraggingState((prev) => ({
      ...prev,
      activeIndex: thisIndex,
      activeContainerId: id,
      isDragTransitionEnd: false,
    }));
    setSourceContainerId(id);
  };

  //拖拽过程中
  const handleOnDrag = useCallback(
    //TODO: 如果拖动距离小于一定值，不应该触发onDragEnd，或者至少不应该触发getBoundingClientRect
    async (e: ComposedEvent) => {
      console.log("handleOnDrag");
      onDrag?.(e);
      //暂时不支持移动端
      if (e instanceof TouchEvent) {
        return;
      }
      // console.log("e", e.clientX, e.clientY);
      const newContainerId = enableCross
        ? inWhichContainer(e.clientX, e.clientY)
        : id;
      console.log("newContainerId", newContainerId, id);

      if (newContainerId === null) {
        await handleResetTransform(true);
        return;
      }

      const newIndex = calculateNewIndex(
        e.target as HTMLElement,
        newContainerId,
        containerCoordinate
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
      containerCoordinate,
    ]
  );

  // useEffect(() => {
  //   console.log("draggingState", draggingState);
  //   console.log("thisIndex", thisIndex);
  // }, [draggingState]);

  //结束拖拽
  const handleDragEnd = async (e: ComposedEvent) => {
    onDragEnd?.(e);
    try {
      if (!thisRef.current) return;

      if (e instanceof TouchEvent) {
        return;
      }
      // console.log("e", e.clientX, e.clientY);

      const newContainerId = enableCross
        ? inWhichContainer(e.clientX, e.clientY)
        : id;
      // console.log("inThisContainerId", inThisContainerId);
      if (newContainerId === null) {
        await handleResetTransform(true);
        return;
      }

      const newIndex = calculateNewIndex(
        e.target as HTMLElement,
        newContainerId,
        containerCoordinate
      );

      const finalTransform = getFinalTransform(
        thisIndex,
        newIndex,
        getContainerInfoById(newContainerId),
        gridLayout,
        unitSize
      );

      console.log("final state", newContainerId, id, newIndex, thisIndex);
      setDraggingState((prev) => ({
        ...prev,
        activeIndex: null,
        overIndex: null,
      }));
      if (newContainerId !== id && enableCross) {
        // 进入其他容器
        onCross(
          { containerId: id, index: thisIndex },
          {
            containerId: newContainerId,
            index: newIndex,
          }
        );
      } else {
        if (newIndex !== thisIndex) {
          //进入同一容器的其他网格
          await handleFinalTransform(finalTransform);
          await eventBus.publish("resetTransform");
          onReorder(thisIndex, newIndex, draggingState.activeIndex as number);
        } else {
          //回到原网格
          await handleResetTransform(true);
        }
      }
    } catch (error) {
      console.error("拖拽结束处理出错:", error);
    }
  };

  const handleDragTransitionEnd = () => {
    //防止过渡动画没有结束就开始了新的拖拽
    setDraggingState((prev) => ({
      ...prev,
      isDragTransitionEnd: true,
    }));
    console.log("handleDragTransitionEnd");
  };

  //将handleOnDrag函数节流
  const throttledHandleOnDrag = useThrottle(handleOnDrag, 50);
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
        onDragTransitionEnd={() => handleDragTransitionEnd()}
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
