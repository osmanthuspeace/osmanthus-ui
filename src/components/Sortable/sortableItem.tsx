import { forwardRef, useContext } from "react";
import { Squircle } from "../Squircle/squircle";
import { Waggle } from "../Waggle/waggle";
import { Draggable } from "../Drag/draggable";
import { SortableItemProps } from "./interface";
import IndexContext from "./context/indexContext";

const SortableItemInternal = (
  props: SortableItemProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const { id, children, enableBorder } = props;
  const index = useContext(IndexContext);

  return (
    <Draggable className="drag-item" id={id!} thisIndex={index} ref={ref}>
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
