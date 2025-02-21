import { motion, PanInfo, useMotionValue } from "motion/react";
import { forwardRef, Ref, useContext, useEffect, useState } from "react";
import { throttle } from "../../utils/throttle";
import "./draggable.css";
import useSortableStore, { Id } from "../../temp-store/useSortableStore";
import SortableContext from "../Sortable/sortableContext";
import { getCoordinate } from "../../utils/getCoordinate";
import { useRef } from "react";
import { calculateIndexByCooridnate } from "../../utils/calculate";
import { col } from "motion/react-client";
interface Translate {
  x: number;
  y: number;
}

interface DragItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "translate"> {
  id: Id;
  thisIndex: number;
  translate?: Translate | undefined;
  // index: number;
  // scope: React.RefObject<HTMLDivElement>;
  // containerRect: DOMRect | undefined;
}
const DraggableInternal = (
  props: DragItemProps,
  ref: Ref<HTMLDivElement> | undefined
) => {
  const { id, thisIndex, children, style, translate } = props;
  const {
    isActive,
    onReorder,
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
  const thisRef = useRef<HTMLDivElement>(null);

  const [shouldSnapToOrigin, setShouldSnapToOrigin] = useState(false);
  useEffect(() => {}, []);

  const handleDragStart = (e: MouseEvent, info: any) => {
    console.log("handleDragStart");
    setShouldSnapToOrigin(false);
    setDraggingState((prev) => ({
      ...prev,
      activeIndex: thisIndex,
    }));
  };
  const handleOnDrag = (e: MouseEvent, info: PanInfo) => {
    // console.log("info", info);
    // console.log("e", e.clientX, e.clientY);
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
    // console.log("x", x, "y", y);

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
  const handleDragEnd = (e: MouseEvent, info: any) => {
    console.log("handleDragEnd");

    if (!thisRef.current) return;
    const transform = thisRef.current.style.transform;
    const regex = /translateX\(([-\d.]+)px\)\s*translateY\(([-\d.]+)px\)/;
    const matrix = transform.match(regex);
    if (!matrix) return;
    const translateX = parseFloat(matrix[1]);
    const translateY = parseFloat(matrix[2]);

    if (Math.abs(translateX) < 100 && Math.abs(translateY) < 100) {
      console.log("back");
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
        //只能在最后的时候调用
        onReorder(thisIndex, index);

        setIsDragEnd(true);
        console.log(thisRef.current.style.transform);

        console.log("draggingState.activeIndex", draggingState.activeIndex);

        thisRef.current.style.transform = null;
      }
      setShouldSnapToOrigin(false);
    }
    //恢复状态
  };
  const throttledHandleOnDrag = throttle(handleOnDrag, 500);

  const getTransform = () => {
    let transform = { x: 0, y: 0 };

    if (
      draggingState.activeIndex === null ||
      draggingState.overIndex === null ||
      thisIndex === draggingState.activeIndex
    )
      return { x: 0, y: 0 };

    //当拖动元素向右移动时
    if (draggingState.overIndex > draggingState.activeIndex) {
      //如果当前元素在拖动元素的路径上，则需要移动
      if (
        thisIndex > draggingState.activeIndex &&
        thisIndex <= draggingState.overIndex
      ) {
        if (thisIndex % gridLayout.columns === 0) {
          //说明元素在最左边，需要移动到上一行的最右边
          transform = {
            x:
              (gridLayout.columns - 1) * unitSize +
              (gridLayout.columns - 1) * gridLayout.gap,
            y: -unitSize - gridLayout.gap,
          };
        } else {
          transform = {
            x: -unitSize - gridLayout.gap,
            y: 0,
          };
        }
      }
    }

    //当拖动元素向左移动时
    if (draggingState.overIndex < draggingState.activeIndex) {
      if (
        thisIndex >= draggingState.overIndex &&
        thisIndex < draggingState.activeIndex
      ) {
        if (thisIndex % gridLayout.columns === gridLayout.columns - 1) {
          transform = {
            x: -(
              (gridLayout.columns - 1) * unitSize +
              (gridLayout.columns - 1) * gridLayout.gap
            ),
            y: unitSize + gridLayout.gap,
          };
        } else {
          transform = {
            x: unitSize + gridLayout.gap,
            y: 0,
          };
        }
      }
    }
    // console.log("transform", thisIndex, transform);
    return transform;
  };

  return (
    <>
      <motion.div
        className="drag-item"
        ref={thisRef}
        drag
        // dragConstraints={scope}
        dragMomentum={false} //拖动惯性
        dragElastic={0.1}
        whileDrag={{ scale: 1.1, zIndex: 100 }}
        dragSnapToOrigin={shouldSnapToOrigin} //是否回到原点
        // dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }} //回弹效果
        transition={{ type: "spring", stiffness: 300, damping: 30 }} //速度，减速度
        onDragStart={(e, info) => handleDragStart(e as MouseEvent, info)}
        onDrag={(e, info) => throttledHandleOnDrag(e, info)}
        onDragEnd={(e, info) => handleDragEnd(e as MouseEvent, info)}
        animate={
          draggingState.activeIndex !== null && !isDragEnd
            ? getTransform()
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
