import {
  motion,
  PanInfo,
  useAnimate,
  useAnimationControls,
} from "motion/react";
import { act, forwardRef, Ref, useContext, useEffect, useState } from "react";
import { throttle } from "../../utils/throttle";
import "./draggable.css";
import SortableContext from "../Sortable/sortableContext";
import { getCoordinate } from "../../utils/getCoordinate";
import { useRef } from "react";
import { calculateIndexByCooridnate } from "../../utils/calculate";
import { useComposeRef } from "../../utils/ref";
import { Id } from "../../type";
import getTransform from "../../utils/getTransform";
import { useThrottle, useThrottleWithRuturnValue } from "../../hooks/useThrottle";
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
    unitSize,
    gridLayout,
    draggingState,
    setDraggingState,
  } = useContext(SortableContext);

  // const [originCoordinate, setOriginCoordinate] = useState({
  //   x: 0,
  //   y: 0,
  // });
  const [_transform, setTransform] = useState<Translate | undefined>(undefined);
  const [isDragEnd, setIsDragEnd] = useState(false);
  //追踪activeIndex的元素是否时拖动之后回到原位
  // const [isMoved, setIsMoved] = useState(false);
  //追踪是否进入过其他的cell
  const [isOuted, setIsOuted] = useState(false);
  const thisRef = useRef<HTMLDivElement>(null);

  const composedRef = useComposeRef(thisRef, ref);

  const thisTransform = useThrottleWithRuturnValue(getTransform);

  const controls = useAnimationControls();

  const handleDragStart = () => {
    console.log("handleDragStart");
    setIsMoved(false);
    setDraggingState((prev) => ({
      ...prev,
      activeIndex: thisIndex,
    }));
  };
  const handleOnDrag = (e: MouseEvent) => {
    if (!thisRef.current) return;
    const transform = thisRef.current.style.transform;
    const matrix = transform.match(/^translate\(([^,]+)px, ([^,]+)px\)$/);
    if (matrix) {
      setTransform({
        x: parseFloat(matrix[1]),
        y: parseFloat(matrix[2]),
      });
    }
    console.log("handleOnDrag");

    const { x, y } = getCoordinate(e.target as HTMLElement);

    //检测状态，是否进入了其他的cell
    const newIndex = calculateIndexByCooridnate(x, y, 50, 50, 100, 0, 0, 2);

    if (newIndex !== thisIndex) {
      console.log("enter other cell");
      //此时不应该调用onReorder，因为会导致重新渲染
      //此时应该让这个index之后的元素都往前/后移动
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
  };

  useEffect(() => {
    if (draggingState.activeIndex === null || isDragEnd) return;

    try {
      const transform = thisTransform(
        thisIndex,
        draggingState,
        gridLayout,
        unitSize
      );

      if (transform.x !== 0 || transform.y !== 0) {
        controls.start({
          x: transform.x,
          y: transform.y,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        });
      } else {
        // controls.stop();
        controls.set({ x: 0, y: 0 });
      }
    } catch (e) {
      console.error("error", e);
    }
  }, [
    controls,
    draggingState,
    gridLayout,
    isDragEnd,
    thisIndex,
    thisTransform,
    unitSize,
    isMoved,
  ]);

  const handleDragEnd = async (e: MouseEvent) => {
    console.log("handleDragEnd");

    if (!thisRef.current) return;
    const transform = thisRef.current.style.transform;
    const regex = /translateX\(([-\d.]+)px\)\s*translateY\(([-\d.]+)px\)/;
    const matrix = transform.match(regex);
    if (!matrix) return;
    const translateX = parseFloat(matrix[1]);
    const translateY = parseFloat(matrix[2]);

    // 重置样式
    if (Math.abs(translateX) < 100 && Math.abs(translateY) < 100) {
      console.log("back");
      await controls.start({
        x: 0,
        y: 0,
        transition: { duration: 0.1 },
      });
    } else {
      console.log("in other cell");

      const { x, y } = getCoordinate(e.target as HTMLElement);

      const newIndex = calculateIndexByCooridnate(x, y, 50, 50, 100, 0, 0, 2);
      if (newIndex !== thisIndex) {
        console.log("enter other cell");

        setDraggingState((prev) => ({
          ...prev,
          activeIndex: null,
          overIndex: null,
        }));
        onReorder(thisIndex, newIndex);
        console.log("settimeout");
        await controls.start({
          x: 0,
          y: 0,
          transition: { duration: 1 },
        });
        // thisRef.current.style.transform = "none";

        setIsDragEnd(true);
      } else {
        await controls.start({
          x: 0,
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        });
      }
    }
  };
  const throttledHandleOnDrag = throttle(handleOnDrag, 1000);

  return (
    <>
      <motion.div
        className="drag-item"
        ref={composedRef}
        // layout
        // layoutId={id.toString()}
        drag
        dragMomentum={false} //拖动惯性
        dragElastic={0.1}
        whileDrag={{ scale: 1.05, zIndex: 100 }}
        dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }} //回弹效果
        transition={{ type: "spring", stiffness: 300, damping: 30 }} //速度，减速度
        onDragStart={() => handleDragStart()}
        onDrag={(e, info) => throttledHandleOnDrag(e, info)}
        onDragEnd={(e) => handleDragEnd(e as MouseEvent)}
        // variants={{
        //   movement: thisTransform(
        //     thisIndex,
        //     draggingState,
        //     gridLayout,
        //     unitSize
        //   ),
        //   noMove: { x: 0, y: 0 },
        // }}
        animate={controls}
        style={
          {
            width: `${unitSize}px`,
            height: `${unitSize}px`,

            ...style,
            "--translate-x": `${_transform?.x ?? 0}px`,
            "--translate-y": `${_transform?.y ?? 0}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </motion.div>
    </>
  );
};
const Draggable = forwardRef<HTMLDivElement, DragItemProps>(DraggableInternal);
export default Draggable;
