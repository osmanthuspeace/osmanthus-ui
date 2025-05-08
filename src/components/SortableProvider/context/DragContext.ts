import { createContext } from "react";
import { DragContextProps } from "../interface";
import { initialDraggingState } from "../util/reducer";

const defaultContext: DragContextProps = {
  draggingState: initialDraggingState,
  dispatch: () => {},
};

const DragContext = createContext(defaultContext);
export default DragContext;
