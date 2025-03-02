import { createContext } from "react";
import { DraggingState } from "./sortContainer";

export interface GridLayout {
  columns: number;
  rows: number;
  gap: number;
  padding: number;
}

interface SortableContextProps {
  width: number;
  height: number;
  isActive: boolean;
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
}

const defaultContext: SortableContextProps = {
  width: 100,
  height: 100,
  isActive: false,
  onReorder: () => {},
  unitSize: 100,
  shouldClearTransform: false,
  setShouldClearTransform: () => {},
  containerCoordinate: { x: 0, y: 0 },
  gridLayout: {
    columns: 2,
    rows: 4,
    gap: 50,
    padding: 0,
  },
  draggingState: {
    activeIndex: null,
    overIndex: null,
    itemCount: 0,
  },
  setDraggingState: () => {},
  containerRef: null,
  enableBorder: true,
};

const SortableContext = createContext(defaultContext);
export default SortableContext;
