import { createContext } from "react";
import { DraggingState } from "./sortContainer";

interface SortableContextProps {
  width: number;
  height: number;
  isActive: boolean;
  isMoved: boolean; //追踪activeIndex的元素是否时拖动之后回到原位
  shouldClearTransform: boolean;
  setShouldClearTransform: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMoved: React.Dispatch<React.SetStateAction<boolean>>;
  isStart: boolean;
  setIsStart: React.Dispatch<React.SetStateAction<boolean>>;
  onReorder: (oldIndex: number, newIndex: number) => void;
  containerCooridnate: { x: number; y: number };
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
  shouldClearTransform: false,
  setShouldClearTransform: () => {},
  isStart: false,
  setIsStart: () => {},
  containerCooridnate: { x: 0, y: 0 },
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
