import { forwardRef } from "react";
import Squircle from "../Squircle/squircle";
import Waggle from "../Waggle/waggle";
import Draggable from "../Drag/draggable";
import { Id } from "../../temp-store/useSortableStore";
import SortableContext from "./sortableContext";

interface SortableItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  id: Id;
  index: number;
  isActive: boolean;
  width?: number;
  height?: number;
}

const SortableItemInternal = (props: SortableItemProps) => {
  const { id, index, children, isActive, width = 100, height = 100 } = props;
  return (
    <SortableContext.Provider value={{ width, height, isActive }}>
      <Draggable id={id} index={index} className="drag-item">
        <Waggle className="waggle-item">
          <Squircle className="squircle">{children}</Squircle>
        </Waggle>
      </Draggable>
    </SortableContext.Provider>
  );
};
const SortableItem = forwardRef<HTMLDivElement, SortableItemProps>(
  SortableItemInternal
);
export default SortableItem;
