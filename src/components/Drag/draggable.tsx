import { motion, PanInfo } from "motion/react";
import { forwardRef, Ref, useCallback, useContext, useEffect } from "react";
import SortableContext from "../SortableContainer/context/sortableContext";
import { useRef } from "react";
import { useComposeRef } from "../../hooks/useComposeRef";
import { usePositionCalculator } from "./hooks/usePositionCalculator";
import { useTransformControl } from "./hooks/useTransformControl";
import { ComposedEvent, DragItemProps } from "./interface";
import { useWhichContainer } from "./hooks/useWhichContainer";
import { useThrottle } from "../../hooks/useThrottle";
import { getFinalTransform } from "./_utils/getFinalTransform";
import "./draggable.css";
import { eventBus } from "./_utils/eventBus";
import { noop } from "../../utils/noop";
import LayoutContext from "../SortableContainer/context/LayoutContext";
import DragContext from "../SortableProvider/context/DragContext";
import SortableProviderContext from "../SortableProvider/context/SortableProviderContext";
const DraggableInternal = (props: DragItemProps, ref: Ref<HTMLDivElement>) => {
  const { thisIndex, children, style } = props;
  const {
    containerId: thisContainerId,
    onReorder,
    onDragStart,
    onDrag,
    onDragEnd,
    containerCoordinate,
  } = useContext(SortableContext);

  const { unitSize, gridLayout } = useContext(LayoutContext);
  const { draggingState, setDraggingState } = useContext(DragContext);

  const { calculateNewIndex } = usePositionCalculator(
    unitSize,
    thisContainerId
  );

  const thisRef = useRef<HTMLDivElement>(null);

  const [scope, handleFinalTransform, handleResetTransform] =
    useTransformControl(
      thisIndex,
      thisContainerId,
      draggingState,
      gridLayout,
      unitSize
    );
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
    eventBus.subscribe("resetTransform", async () => {
      console.log(thisIndex, "resetTransform");
      await handleResetTransform(false);
    });
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
      activeContainerId: thisContainerId,
    }));
    setSourceContainerId(thisContainerId);
  };

  //拖拽过程中
  const handleOnDrag = useCallback(
    async (e: ComposedEvent, info: PanInfo) => {
      onDrag?.(e);
      //TODO: 如果拖动距离小于一定值，不应该触发onDragEnd，或者至少不应该触发getBoundingClientRect
      if (info.delta.x === 0 && info.delta.y === 0) {
        return;
      }
      // console.log("handleOnDrag", info);

      //暂时不支持移动端
      if (e instanceof TouchEvent) {
        return;
      }

      const direction = info.delta.x > 0 ? "right" : "left";

      // console.log("e", e.clientX, e.clientY);
      const newContainerId = enableCross
        ? inWhichContainer(e.clientX, e.clientY)
        : thisContainerId;

      if (newContainerId === null) {
        return;
      }

      const newIndex = calculateNewIndex(
        e.target as HTMLElement,
        newContainerId
      );
      console.log("[onDrag] 组件新的位置信息", newContainerId, newIndex);

      setDraggingState((prev) => ({
        ...prev,
        overIndex: newIndex,
        overContainerId: newContainerId,
        direction,
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
        : thisContainerId;
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
        thisIndex,
        newIndex,
        getContainerInfoById(newContainerId),
        gridLayout,
        unitSize
      );

      console.log(
        "[Drag End] ",
        "新容器：",
        newContainerId,
        "原先的容器：",
        thisContainerId,
        "新的index：",
        newIndex,
        "原先的index：",
        thisIndex
      );
      setDraggingState((prev) => ({
        ...prev,
        activeIndex: null,
        activeContainerId: null,
        overIndex: null,
        overContainerId: null,
      }));

      const isSameContainer = newContainerId === thisContainerId;

      if (!isSameContainer && enableCross) {
        // 进入其他容器
        onCross(
          { containerId: thisContainerId, index: thisIndex },
          {
            containerId: newContainerId,
            index: newIndex,
          }
        );
        console.log("发送resetTransform信号");
        await eventBus.publish("resetTransform");
      } else {
        if (newIndex !== thisIndex) {
          //进入同一容器的其他网格
          await handleFinalTransform(finalTransform);
          console.log("发送resetTransform信号");
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
    console.log("handleDragTransitionEnd");
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
        onDrag={(e, info) => throttledHandleOnDrag(e, info)}
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
