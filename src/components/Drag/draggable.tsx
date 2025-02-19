import { motion } from "motion/react";
import { forwardRef, Ref, useContext } from "react";
import { throttle } from "../../utils/throttle";
import "./draggable.css";
import useSortableStore, { Id } from "../../temp-store/useSortableStore";
import SortableContext from "../Sortable/sortableContext";

interface Translate {
  x: number;
  y: number;
}

interface DragItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "translate"> {
  id: Id;
  translate?: Translate | undefined;
  // index: number;
  // scope: React.RefObject<HTMLDivElement>;
  // containerRect: DOMRect | undefined;
}
const DraggableInternal = (
  props: DragItemProps,
  ref: Ref<HTMLDivElement> | undefined
) => {
  const { id, children, style, translate } = props;
  const { setActiveId } = useSortableStore();
  const { isActive, width, height } = useContext(SortableContext);

  const handleDragStart = (e: MouseEvent, info: any) => {
    console.log("handleDragStart");
    console.log("id", id);

    setActiveId(id);

    //通知父组件，
  };
  const handleOnDrag = (e: MouseEvent, info: any) => {
    //检测状态
    console.log("handleOnDrag");
  };
  const handleDragEnd = (e: MouseEvent, info: any) => {
    //恢复状态
    console.log("handleDragEnd");
    setActiveId(null);
  };
  const throttledHandleOnDrag = throttle(handleOnDrag, 100);

  return (
    <>
      <motion.div
        className="drag-item"
        ref={ref}
        drag
        // dragConstraints={scope}
        dragMomentum={false}
        dragSnapToOrigin={false}
        dragElastic={0.1}
        whileDrag={{ scale: 1.1, zIndex: 100 }}
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
