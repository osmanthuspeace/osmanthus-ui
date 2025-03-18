import { createContext } from "react";
import { SortableContextProps } from "../interface";


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
  onDragStart: () => {},
  onDrag: () => {},
  onDragEnd: () => {},
};

const SortableContext = createContext(defaultContext);
export default SortableContext;
