import { Id } from "../../type";
import { ComposedEvent, DraggingState } from "../Drag/interface";

// =============SortableContext================
export interface GridLayout {
  columns: number;
  rows: number;
  gap: number;
  padding: number;
}
export interface SortableContextProps {
  id: string;
  width: number;
  height: number;
  enableDnd: boolean;
  shouldClearTransform: boolean;
  setShouldClearTransform: React.Dispatch<React.SetStateAction<boolean>>;
  onReorder: (oldIndex: number, newIndex: number) => void;
  containerCoordinate: { x: number; y: number };
  unitSize: number;
  gridLayout: GridLayout;
  draggingState: DraggingState;
  setDraggingState: React.Dispatch<React.SetStateAction<DraggingState>>;
  containerRef: React.RefObject<HTMLDivElement> | null;
  enableBorder?: boolean;
  onDragStart?: (e: ComposedEvent) => void | undefined;
  onDrag?: (e: ComposedEvent) => void | undefined;
  onDragEnd?: (e: ComposedEvent) => void | undefined;
}

// =============SortableItem================
export interface SortableItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  id?: Id;
  index?: number;
  width?: number;
  height?: number;
  enableBorder?: boolean;
  flipBack?: React.ReactNode;
}
export interface ISortableItem {
  id: Id;
  children: React.ReactNode;
}
export type SortableItems = ISortableItem[];

// =============SortContainer================
export interface SortContainerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
  > {
  id: string;
  width?: number;
  height?: number;
  unitSize?: number;
  gridTemplateRows?: number;
  gridTemplateColumns?: number;
  gridGap?: number;
  enableDnd?: boolean;
  onOrderChange?: (newOrderIds: string[]) => void;
  onDragStart?: (e: ComposedEvent) => void;
  onDragEnd?: (e: ComposedEvent) => void;
  onAnyDrag?: (e: ComposedEvent) => void;
}
