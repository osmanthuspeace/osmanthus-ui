import { DraggingState } from "../Draggable/interface";
import { GridLayout } from "../SortableContainer/interface";
import { SortableItems } from "../SortableItem/interface";
import { DragAction } from "./util/reducer";

export interface CrossInfo {
  containerId: string;
  index: number;
}
export interface CrossEventParams {
  source: CrossInfo;
  target: CrossInfo;
}
export type CrossMap = Record<
  string,
  [SortableItems, React.Dispatch<React.SetStateAction<SortableItems>>]
>;
export interface ContainerRect {
  top: number;
  left: number;
  width: number;
  height: number;
}
export interface ContainerInfo {
  rect: ContainerRect;
  childrenLength: number;
  gridLayout: GridLayout;
}

// =============DragContext================
export interface DragContextProps {
  draggingState: DraggingState;
  dispatch: React.Dispatch<DragAction>;
  isDragEnded: boolean;
  setIsDragEnded: React.Dispatch<React.SetStateAction<boolean>>;
}
