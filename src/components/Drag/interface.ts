import { Id } from "../../type";

export interface DragItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "translate"> {
  id: Id;
  thisIndex: number;
}
export type ComposedEvent = MouseEvent | TouchEvent | PointerEvent;

export interface DraggingState {
  activeIndex: number | null;
  activeContainerId: string | null;
  overIndex: number | null;
  overContainerId: string | null;
}
