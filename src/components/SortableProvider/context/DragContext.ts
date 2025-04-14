import { createContext } from "react";
import { DragContextProps } from "../interface";

const defaultContext: DragContextProps = {
  draggingState: {
    activeIndex: null,
    activeContainerId: null,
    overIndex: null,
    overContainerId: null,
    direction: null,
  },
  setDraggingState: () => {},
};

const DragContext = createContext(defaultContext);
export default DragContext;
