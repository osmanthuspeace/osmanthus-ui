import { createContext } from "react";
import { DraggingState } from "./sortContainer";

interface SortableContextProps {
  width: number;
  height: number;
  isActive: boolean;
  isMoved: boolean;
  setIsMoved: React.Dispatch<React.SetStateAction<boolean>>;
  onReorder: (oldIndex: number, newIndex: number) => void;
  unitSize: number;
  gridLayout: {
    columns: number;
    rows: number;
    gap: number;
    padding: number;
  };
  draggingState: DraggingState;
  setDraggingState: React.Dispatch<React.SetStateAction<DraggingState>>;
  containerRef: React.RefObject<HTMLDivElement> | null;
}

const defaultContext: SortableContextProps = {
  width: 100,
  height: 100,
  isActive: false,
  isMoved: false,
  setIsMoved: () => {},
  onReorder: () => {},
  unitSize: 100,
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
};

const SortableContext = createContext(defaultContext);
export default SortableContext;
