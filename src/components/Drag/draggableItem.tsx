import { motion } from "motion/react";
import { forwardRef } from "react";
import { throttle } from "../../utils/throttle";

interface DragItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  // id: number;
  // index: number;
  // scope: React.RefObject<HTMLDivElement>;
  // containerRect: DOMRect | undefined;
}
const DraggableItemInternal = (props: DragItemProps) => {
  const { children } = props;
  const handleDragStart = (e: MouseEvent, info: any) => {};
  const handleOnDrag = (e: MouseEvent, info: any) => {};
  const handleDragEnd = (e: MouseEvent, info: any) => {};
  const throttledHandleOnDrag = throttle(handleOnDrag, 100);

  return (
    <>
      <motion.div
        drag
        // dragConstraints={scope}
        dragMomentum={false}
        dragSnapToOrigin={false}
        dragElastic={0.1}
        whileDrag={{ scale: 1.1, zIndex: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }} //速度，减速度
        // onDragStart={(e, info) => handleDragStart(e, info)}
        // onDrag={(e, info) => throttledHandleOnDrag(e, info)}
        // onDragEnd={(e, info) => handleDragEnd(e, info)}
      >
        {children}
      </motion.div>
    </>
  );
};
const DraggableItem = forwardRef<HTMLDivElement, DragItemProps>(
  DraggableItemInternal
);
export default DraggableItem;
