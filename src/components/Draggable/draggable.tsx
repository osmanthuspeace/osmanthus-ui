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
import LayoutContext from "../SortableContainer/context/layoutContext";
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
    duration,
  } = useContext(SortableContext);

  const { unitSize } = useContext(LayoutContext);
  const { draggingState, dispatch, isDragEnded, setIsDragEnded } =
    useContext(DragContext);

  const { calculateNewIndex } = usePositionCalculator(
    unitSize,
    thisContainerId
  );

  const thisRef = useRef<HTMLDivElement>(null);

  const [scope, handleFinalTransform, handleResetTransform] =
    useTransformControl(thisIndex, thisContainerId, draggingState, duration);
  const composedRef = useComposeRef(scope, thisRef, ref);

  const getContainerIdByCoordinate = useWhichContainer();

  const { onCross, getContainerInfoById } =
    useContext(SortableProviderContext) || {};

  const enableCross = onCross !== noop;

  useEffect(() => {
    eventBus.subscribe("resetTransform", async () => {
      await handleResetTransform(false);
    });
    return () => {
      eventBus.unsubscribe("resetTransform", async () => {
        await handleResetTransform(false);
      });
    };
  }, [handleResetTransform]);

  //开始拖拽
  const handleDragStart = async (e: ComposedEvent) => {
    onDragStart?.(e);
    dispatch({
      type: "DragStart",
      payload: {
        activeIndex: thisIndex,
        activeContainerId: thisContainerId,
      },
    });
  };

  const getNewContainerId = (e: ComposedEvent) => {
    // Safari不支持TouchEvent
    const isTouchEvent = "touches" in e && e.touches?.length > 0;
    const { clientX, clientY } = isTouchEvent
      ? e.touches[0] || { clientX: 0, clientY: 0 }
      : (e as MouseEvent | PointerEvent);
    const newContainerId = enableCross
      ? getContainerIdByCoordinate(clientX, clientY)
      : thisContainerId;
    return newContainerId;
  };

  //拖拽过程中
  const handleOnDrag = useCallback(
    async (e: ComposedEvent, info: PanInfo) => {
      onDrag?.(e);
      if (info.delta.x === 0 && info.delta.y === 0) {
        return;
      }
      const direction = info.delta.x > 0 ? "right" : "left";

      // console.log("实时位置：", e.clientX, e.clientY, "方向：", direction);

      const newContainerId = getNewContainerId(e);
      if (newContainerId === null) {
        return;
      }
      const newIndex = calculateNewIndex(
        e.target as HTMLElement,
        newContainerId
      );
      // console.log("[onDrag] 组件新的位置信息", newContainerId, newIndex);
      dispatch({
        type: "Dragging",
        payload: {
          overIndex: newIndex,
          overContainerId: newContainerId,
          direction,
        },
      });
    },
    [
      calculateNewIndex,
      handleResetTransform,
      getNewContainerId,
      onDrag,
      dispatch,
      containerCoordinate,
    ]
  );

  //结束拖拽
  const handleDragEnd = async (e: ComposedEvent) => {
    onDragEnd?.(e);
    setIsDragEnded(false);

    try {
      if (!thisRef.current) return;

      const newContainerId = getNewContainerId(e);

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
        getContainerInfoById(draggingState.activeContainerId),
        newIndex,
        getContainerInfoById(newContainerId),
        unitSize
      );

      dispatch({
        type: "DragEnd",
        payload: null,
      });

      const isSameContainer = newContainerId === thisContainerId;

      if (!isSameContainer && enableCross) {
        // 进入其他容器
        await handleFinalTransform(finalTransform);
        await eventBus.publish("resetTransform");
        if (!onCross)
          throw new Error(
            "onCross function is required when using mutiple containers"
          );
        onCross(
          { containerId: thisContainerId, index: thisIndex },
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
    } finally {
      setIsDragEnded(true);
    }
  };

  //将handleOnDrag函数节流
  const throttledHandleOnDrag = useThrottle(handleOnDrag, 10);
  return (
    <>
      <motion.div
        className="drag-item"
        ref={composedRef}
        drag={isDragEnded}
        dragMomentum={false}
        dragElastic={0.1}
        whileDrag={{ scale: 1.1, zIndex: 100 }}
        // dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }} //回弹效果
        transition={{ type: "spring", stiffness: 300, damping: 30 }} //速度，减速度
        onDragStart={(e) => handleDragStart(e)}
        onDrag={(e, info) => throttledHandleOnDrag(e, info)}
        onDragEnd={(e) => handleDragEnd(e)}
        // onDragTransitionEnd={() => handleDragTransitionEnd()}
        style={
          {
            width: `${unitSize}px`,
            height: `${unitSize}px`,
            willChange: "transform",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            userSelect: "none",
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
