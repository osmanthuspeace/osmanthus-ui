import { forwardRef } from "react";

interface DragItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  id: number;
  index: number;
  scope: React.RefObject<HTMLDivElement>;
  containerRect: DOMRect | undefined;
}
const DragItemInternal = (props: DragItemProps) => {
  return <></>;
};
const DragItem = forwardRef<HTMLDivElement, DragItemProps>(DragItemInternal);
export default DragItem;
