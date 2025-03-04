import { forwardRef, useContext } from "react";
import { Squircle } from "../Squircle/squircle";
import { Waggle } from "../Waggle/waggle";
import { Draggable } from "../Drag/draggable";
import SortableContext from "./sortableContext";
import { SortableItemProps } from "./interface";


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
