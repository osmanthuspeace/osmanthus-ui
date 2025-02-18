import { forwardRef } from "react";
import Squircle from "../Squircle/squircle";
import Waggle from "../Waggle/waggle";
import DraggableItem from "./draggableItem";

interface SortableItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean;
}

const SortableItemInternal = (props: SortableItemProps) => {
  const { children, isActive } = props;
  return (
    <>
      <DraggableItem className="drag-item">
        <Waggle isActive={isActive} className="waggle-item">
          <Squircle isActive={isActive} className="squircle">
            {children}
          </Squircle>
        </Waggle>
      </DraggableItem>
    </>
  );
};
const SortableItem = forwardRef<HTMLDivElement, SortableItemProps>(
  SortableItemInternal
);
export default SortableItem;
