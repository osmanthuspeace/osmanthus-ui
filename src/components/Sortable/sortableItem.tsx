import { forwardRef } from "react";
import Squircle from "../Squircle/squircle";
import Waggle from "../Waggle/waggle";
import Draggable from "../Drag/draggable";
import { Id } from "../../type";

interface SortableItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  id: Id;
  index: number;
  width?: number;
  height?: number;
}

const SortableItemInternal = (props: SortableItemProps) => {
  const { id, index, children } = props;
  return (
    <Draggable id={id} thisIndex={index} className="drag-item">
      <Waggle className="waggle-item">
        <Squircle className="squircle">{children}</Squircle>
      </Waggle>
    </Draggable>
  );
};
const SortableItem = forwardRef<HTMLDivElement, SortableItemProps>(
  SortableItemInternal
);
export default SortableItem;
