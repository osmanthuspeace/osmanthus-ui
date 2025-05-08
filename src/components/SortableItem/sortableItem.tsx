import { forwardRef, useContext } from "react";
import { Squircle } from "../Squircle/squircle";
import { Waggle } from "../Waggle/waggle";
import { Draggable } from "../Draggable/draggable";
import { SortableItemProps } from "./interface";
import IndexContext from "./context/indexContext";
import useItemRef from "../SortableContainer/hooks/useItemRef";

const SortableItemInternal = (
  props: SortableItemProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const { id, children, enableBorder } = props;
  const { index } = useContext(IndexContext);

  const composedRef = useItemRef(index, ref);

  return (
    <Draggable
      className="drag-item"
      id={id!}
      thisIndex={index}
      ref={composedRef}
    >
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
