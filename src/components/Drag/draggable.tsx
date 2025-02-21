import { motion, PanInfo, useAnimate } from "motion/react";
import { forwardRef, Ref, useContext, useEffect, useState } from "react";
import { throttle } from "../../utils/throttle";
import "./draggable.css";
import SortableContext from "../Sortable/sortableContext";
import { getCoordinate } from "../../utils/getCoordinate";
import { useRef } from "react";
import { calculateIndexByCooridnate } from "../../utils/calculate";
import { useComposeRef } from "../../utils/ref";
import { Id } from "../../type";
import getTransform from "../../utils/getTransform";
interface Translate {
  x: number;
  y: number;
}

interface DragItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "translate"> {
  id: Id;
  thisIndex: number;
  translate?: Translate | undefined;
}
const DraggableInternal = (props: DragItemProps, ref: Ref<HTMLDivElement>) => {
  const { id, thisIndex, children, style, translate } = props;
  const {
    isActive,
    onReorder,
    unitSize,
    gridLayout,
    draggingState,
    setDraggingState,
  } = useContext(SortableContext);
  const [scope, animate] = useAnimate();

  // const [originCoordinate, setOriginCoordinate] = useState({
  //   x: 0,
  //   y: 0,
  // });
  const [_transform, setTransform] = useState<Translate | undefined>(undefined);
  const [isDragEnd, setIsDragEnd] = useState(false);
  const thisRef = useRef<HTMLDivElement>(null);

  const composedRef = useComposeRef(scope, thisRef, ref);

  const [shouldSnapToOrigin, setShouldSnapToOrigin] = useState(false);
  const thisTransform = getTransform(
    thisIndex,
    draggingState,
    gridLayout,
    unitSize
  );
  useEffect(() => {}, []);

  const handleDragStart = () => {
    console.log("handleDragStart");
    setShouldSnapToOrigin(false);
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
    }
  };
  const handleDragEnd = async (e: MouseEvent) => {
    console.log("handleDragEnd");

    if (!thisRef.current) return;
    const transform = thisRef.current.style.transform;
    const regex = /translateX\(([-\d.]+)px\)\s*translateY\(([-\d.]+)px\)/;
    const matrix = transform.match(regex);
    if (!matrix) return;
    const translateX = parseFloat(matrix[1]);
    const translateY = parseFloat(matrix[2]);
    console.log("translateX", translateX, "translateY", translateY);

    // 重置样式
    if (Math.abs(translateX) < 100 && Math.abs(translateY) < 100) {
      console.log("back");
      animate(
        scope.current,
        {
          x: 0,
          y: 0,
        },
        {
          duration: 0.3,
        }
      );
      setShouldSnapToOrigin(true);
    } else {
      console.log("in other cell");

      const { x, y } = getCoordinate(e.target as HTMLElement);

      const index = calculateIndexByCooridnate(x, y, 50, 50, 100, 0, 0, 2);
      if (index !== thisIndex) {
        console.log("enter other cell");

        setDraggingState((prev) => ({
          ...prev,
          activeIndex: null,
          overIndex: null,
        }));
        onReorder(thisIndex, index);
        console.log("settimeout");
        animate(
          scope.current,
          {
            x: 0,
            y: 0,
          },
          {
            duration: 0,
          }
        );
        // thisRef.current.style.transform = "none";

        setIsDragEnd(true);
      } else {
        await animate(
          scope.current,
          {
            x: 0,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            },
          },
          {
            duration: 1,
          }
        );
      }
      setShouldSnapToOrigin(false);
    }
  };
  const throttledHandleOnDrag = throttle(handleOnDrag, 1000);

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
        whileDrag={{ scale: 1.1, zIndex: 100 }}
        dragSnapToOrigin={shouldSnapToOrigin} //是否回到原点
        // dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }} //回弹效果
        transition={{ type: "spring", stiffness: 300, damping: 30 }} //速度，减速度
        onDragStart={() => handleDragStart()}
        onDrag={(e, info) => throttledHandleOnDrag(e, info)}
        onDragEnd={(e) => handleDragEnd(e as MouseEvent)}
        animate={
          draggingState.activeIndex !== null && !isDragEnd
            ? thisTransform
            : { x: 0, y: 0 }
        }
        style={
          {
            width: `${unitSize}px`,
            height: `${unitSize}px`,

            ...style,
            "--translate-x": `${translate?.x ?? 0}px`,
            "--translate-y": `${translate?.y ?? 0}px`,
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
