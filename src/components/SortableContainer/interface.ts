import { ComposedEvent } from "../Draggable/interface";

export interface GridLayout {
  columns: number;
  rows: number;
  gap: number;
  padding: number;
}
// =============LayoutContext================
export interface LayoutContextProps {
  width: number;
  height: number;
  unitSize: number;
  gridLayout: GridLayout;
}

// =============SortableContext================
export interface SortableContextProps {
  containerId: string;
  enableDnd: boolean;
  onReorder: (oldIndex: number, newIndex: number, activeIndex?: number) => void;
  registerItemRef: (index: number, ref: HTMLElement | null) => void;
  containerCoordinate: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement> | null;
  onDragStart?: (e: ComposedEvent) => void | undefined;
  onDrag?: (e: ComposedEvent) => void | undefined;
  onDragEnd?: (e: ComposedEvent) => void | undefined;
}

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
