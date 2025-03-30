import { createContext } from "react";
import { SortableContextProps } from "../interface";


const defaultContext: SortableContextProps = {
  id: "",
  width: 100,
  height: 100,
  enableDnd: false,
  onReorder: () => {},
  registerItemRef: () => {},
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
    activeContainerId: null,
    overIndex: null,
    overContainerId: null,
  },
  setDraggingState: () => {},
  containerRef: null,
  onDragStart: () => {},
  onDrag: () => {},
  onDragEnd: () => {},
};

const SortableContext = createContext(defaultContext);
export default SortableContext;
