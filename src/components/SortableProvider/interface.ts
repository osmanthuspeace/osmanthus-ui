import { SortableItems } from "../SortableItem/interface";

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
}
