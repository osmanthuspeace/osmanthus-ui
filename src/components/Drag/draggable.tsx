import { motion, PanInfo } from "motion/react";
import { forwardRef, Ref, useContext, useEffect, useState } from "react";
import { throttle } from "../../utils/throttle";
import "./draggable.css";
import useSortableStore, { Id } from "../../temp-store/useSortableStore";
import SortableContext from "../Sortable/sortableContext";
import { getCoordinate } from "../../utils/getCoordinate";
import { useRef } from "react";
import { calculateIndexByCooridnate } from "../../utils/calculate";
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
  const { setActiveId } = useSortableStore();
  const { isActive, width, height } = useContext(SortableContext);

  const [originCoordinate, setOriginCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [transform, setTransform] = useState<Translate | undefined>(undefined);

  const thisRef = useRef<HTMLDivElement>(null);

  const [shouldSnapToOrigin, setShouldSnapToOrigin] = useState(false);
  useEffect(() => {}, []);

  const handleDragStart = (e: MouseEvent, info: any) => {
    console.log("handleDragStart");
    console.log("id", id);
    setShouldSnapToOrigin(false);

    const { x, y } = getCoordinate(thisRef.current as HTMLElement);
    setOriginCoordinate({
      x,
      y,
    });
    setActiveId(id);

    //通知父组件
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
    const index = calculateIndexByCooridnate(x, y, 50, 50, 100, 0, 0, 2);

    if (index !== thisIndex) {
      console.log("enter other cell");
    }
    console.log("handleOnDrag");
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
      setShouldSnapToOrigin(false);
      console.log("in other cell");
    }
    //恢复状态
    setActiveId(null);
  };
  const throttledHandleOnDrag = throttle(handleOnDrag, 1000);

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
        dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }} //回弹效果
        transition={{ type: "spring", stiffness: 300, damping: 30 }} //速度，减速度
        onDragStart={(e, info) => handleDragStart(e as MouseEvent, info)}
        onDrag={(e, info) => throttledHandleOnDrag(e, info)}
        onDragEnd={(e, info) => handleDragEnd(e as MouseEvent, info)}
        style={
          {
            width: `${width}px`,
            height: `${height}px`,
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
