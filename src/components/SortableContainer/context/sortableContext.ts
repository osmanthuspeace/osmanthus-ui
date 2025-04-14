import { createContext } from "react";
import { SortableContextProps } from "../interface";

const defaultContext: SortableContextProps = {
  containerId: "",

  enableDnd: false,
  onReorder: () => {},
  registerItemRef: () => {},

  containerCoordinate: { x: 0, y: 0 },

  containerRef: null,
  onDragStart: () => {},
  onDrag: () => {},
  onDragEnd: () => {},
};

const SortableContext = createContext(defaultContext);
export default SortableContext;
