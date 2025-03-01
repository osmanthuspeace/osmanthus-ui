import { motion, useAnimate } from "motion/react";
import {
  forwardRef,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { throttle } from "../../utils/throttle";
import "./draggable.css";
import SortableContext from "../Sortable/sortableContext";
import { getCoordinate } from "../../utils/getCoordinate";
import { useRef } from "react";
import { calculateIndexByCooridnate } from "../../utils/calculate";
import { useComposeRef } from "../../utils/ref";
import { Id } from "../../type";
import getTransform from "../../utils/getTransform";
import { useThrottleWithRuturnValue } from "../../hooks/useThrottle";
import { parseTransform } from "../../utils/parseTransform";

interface DragItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "translate"> {
  id: Id;
  thisIndex: number;
}
const DraggableInternal = (props: DragItemProps, ref: Ref<HTMLDivElement>) => {
  const { thisIndex, children, style } = props;
  const {
    onReorder,
    shouldClearTransform,
    setShouldClearTransform,
    containerCooridnate,
    unitSize,
    gridLayout,
    draggingState,
    setDraggingState,
  } = useContext(SortableContext);

  const [isDragEnd, setIsDragEnd] = useState(false);

  //追踪是否进入过其他的cell
  const [isOuted, setIsOuted] = useState(false);
  const thisRef = useRef<HTMLDivElement>(null);

  const [shouldBack, setShouldBack] = useState(false);

  const thisTransform = useThrottleWithRuturnValue(getTransform);

  const [scope, animate] = useAnimate<HTMLDivElement>();
  const composedRef = useComposeRef(scope, thisRef, ref);

  //在拖拽结束后，每一个组件都要将transform清除
  useEffect(() => {
    if (shouldClearTransform) {
      if (shouldBack) {
        //这里有问题，TODO：通过index计算出transform，再回到0
        animate(scope.current, { x: 0, y: 0 }, { duration: 0 });
        setShouldBack(false);
      } else {
        animate(scope.current, { x: 0, y: 0 }, { duration: 0 });
      }
      setShouldClearTransform(false);
    }
  }, [
    animate,
    scope,
    setShouldClearTransform,
    shouldBack,
    shouldClearTransform,
  ]);

  //拖拽过程中，实时更新transform
  useEffect(() => {
    if (
      draggingState.activeIndex === null ||
      draggingState.overIndex === null ||
      thisIndex === draggingState.activeIndex ||
      isDragEnd
    )
      return;
    try {
      const transform = thisTransform(
        thisIndex,
        draggingState,
        gridLayout,
        unitSize
      );
      if (!transform) {
        throw new Error("transform is null");
      }
      animate(scope.current, transform, { duration: 0.3 });
    } catch (e) {
      console.error("error", e);
    }
  }, [draggingState.overIndex]);

  //开始拖拽
  const handleDragStart = () => {
    console.log("handleDragStart");
    setShouldBack(true);
    setDraggingState((prev) => ({
      ...prev,
      activeIndex: thisIndex,
    }));
  };
  //拖拽过程中
  const handleOnDrag = useCallback(
    (e: MouseEvent) => {
      console.log("handleOnDrag");
      const { x, y } = getCoordinate(e.target as HTMLElement);

      const newIndex = calculateIndexByCooridnate(
        x,
        y,
        50,
        50,
        100,
        containerCooridnate.x,
        containerCooridnate.y,
        2
      );
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
      containerCooridnate.x,
      containerCooridnate.y,
      draggingState.overIndex,
      isOuted,
      setDraggingState,
      thisIndex,
    ]
  );

  //结束拖拽
  const handleDragEnd = async (e: MouseEvent) => {
    console.log("handleDragEnd");
    if (!scope.current) return;
    try {
      if (!thisRef.current) return;
      const [translateX, translateY] = parseTransform(
        thisRef.current.style.transform
      );
      // console.log("translateX, translateY", translateX, translateY);

      if (Math.abs(translateX) > 85 || Math.abs(translateY) > 85) {
        const { x, y } = getCoordinate(e.target as HTMLElement);

        const newIndex = calculateIndexByCooridnate(
          x,
          y,
          50,
          50,
          100,
          containerCooridnate.x,
          containerCooridnate.y,
          2
        );
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
    } finally {
      setIsDragEnd(true);
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
        dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }} //回弹效果
        transition={{ type: "spring", stiffness: 300, damping: 30 }} //速度，减速度
        onDragStart={() => handleDragStart()}
        onDrag={(e) => throttledHandleOnDragRef.current(e as MouseEvent)}
        onDragEnd={(e) => handleDragEnd(e as MouseEvent)}
        onDragTransitionEnd={() => {
          console.log("Drag transition complete");
        }}
        style={
          {
            width: `${unitSize}px`,
            height: `${unitSize}px`,
            ...style,
            // "--translate-x": `${_transform?.x ?? 0}px`,
            // "--translate-y": `${_transform?.y ?? 0}px`,
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
