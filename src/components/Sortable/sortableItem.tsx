import { forwardRef, useContext } from "react";
import { Squircle } from "../Squircle/squircle";
import { Waggle } from "../Waggle/waggle";
import { Draggable } from "../Drag/draggable";
import { Id } from "../../type";
import SortableContext from "./sortableContext";

interface SortableItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  id?: Id;
  index?: number;
  width?: number;
  height?: number;
  enableBorder?: boolean;
}

const SortableItemInternal = (
  props: SortableItemProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const { id, index, children } = props;
  const { enableBorder } = useContext(SortableContext);

  return (
    <Draggable className="drag-item" id={id!} thisIndex={index!} ref={ref}>
      <Waggle className="waggle-item">
        <Squircle className="squircle" enableBorder={enableBorder}>
          {children}
        </Squircle>
      </Waggle>
    </Draggable>
  );
};
const SortableItem = forwardRef<HTMLDivElement, SortableItemProps>(
  SortableItemInternal
);
export { SortableItem };
