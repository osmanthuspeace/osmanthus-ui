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
interface Translate {
  x: number;
  y: number;
}

interface DragItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "translate"> {
  id: Id;
  thisIndex: number;
}
const DraggableInternal = (props: DragItemProps, ref: Ref<HTMLDivElement>) => {
  const { id, thisIndex, children, style } = props;
  const {
    isActive,
    onReorder,
    isMoved,
    setIsMoved,
    shouldClearTransform,
    setShouldClearTransform,
    isStart,
    setIsStart,
    containerCooridnate,
    unitSize,
    gridLayout,
    draggingState,
    setDraggingState,
  } = useContext(SortableContext);

  const [_transform, setTransform] = useState<Translate | undefined>(undefined);
  const [isDragEnd, setIsDragEnd] = useState(false);

  //追踪是否进入过其他的cell
  const [isOuted, setIsOuted] = useState(false);
  const thisRef = useRef<HTMLDivElement>(null);

  const thisTransform = useThrottleWithRuturnValue(getTransform);

  const [scope, animate] = useAnimate<HTMLDivElement>();
  const composedRef = useComposeRef(scope, thisRef, ref);

  //在拖拽结束后，每一个组件都要将transform清除
  useEffect(() => {
    if (shouldClearTransform) {
      // thisRef.current.style.transform = "none";
      animate(scope.current, { x: 0, y: 0 }, { duration: 0 });
      setShouldClearTransform(false);
    }
  }, [animate, scope, setShouldClearTransform, shouldClearTransform]);

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
      const transform = getTransform(
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
    setIsMoved(false);
    setIsStart(true);
    setDraggingState((prev) => ({
      ...prev,
      activeIndex: thisIndex,
    }));
  };
  //拖拽过程中
  const handleOnDrag = useCallback(
    (e: MouseEvent) => {
      console.log("handleOnDrag");

      if (!thisRef.current) return;
      const transform = thisRef.current.style.transform;
      const matrix = transform.match(/^translate\(([^,]+)px, ([^,]+)px\)$/);
      if (matrix) {
        setTransform({
          x: parseFloat(matrix[1]),
          y: parseFloat(matrix[2]),
        });
      }

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
        console.log("enter other cell", newIndex);
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
          setIsMoved(true);
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
      setIsMoved,
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

      if (Math.abs(translateX) > 100 || Math.abs(translateY) > 100) {
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
      }
      setDraggingState((prev) => ({
        ...prev,
        activeIndex: null,
        overIndex: null,
      }));
      setShouldClearTransform(true);
    } catch (error) {
      console.error("拖拽结束处理出错:", error);
    } finally {
      setIsMoved(false);
      setIsDragEnd(true);
      setIsStart(false);
    }
  };

  //将handleOnDrag函数节流
  useEffect(() => {
    throttledHandleOnDragRef.current = throttle(handleOnDrag, 100);
  }, [handleOnDrag]);
  const throttledHandleOnDragRef = useRef(throttle(handleOnDrag, 100));
  const temp_handleClick = () => {
    thisRef.current!.style.transform = "none";
  };
  return (
    <>
      <motion.div
        className="drag-item"
        ref={composedRef}
        layout
        layoutId={id.toString()}
        drag
        dragMomentum={false} //拖动惯性
        dragElastic={0.1}
        whileDrag={{ scale: 1.05, zIndex: 100 }}
        dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }} //回弹效果
        transition={{ type: "spring", stiffness: 300, damping: 30 }} //速度，减速度
        onDragStart={() => handleDragStart()}
        onDrag={(e) => throttledHandleOnDragRef.current(e as MouseEvent)}
        onDragEnd={(e) => handleDragEnd(e as MouseEvent)}
        onDragTransitionEnd={() => console.log("Drag transition complete")}
        style={
          {
            width: `${unitSize}px`,
            height: `${unitSize}px`,
            ...style,
            "--translate-x": `${_transform?.x ?? 0}px`,
            "--translate-y": `${_transform?.y ?? 0}px`,
          } as React.CSSProperties
        }
        exit={{ opacity: 0 }}
      >
        {children}
        <button onClick={temp_handleClick}>重制测试</button>
      </motion.div>
    </>
  );
};
const Draggable = forwardRef<HTMLDivElement, DragItemProps>(DraggableInternal);
export default Draggable;
