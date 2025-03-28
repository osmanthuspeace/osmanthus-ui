import { SortableItems } from "../Sortable/interface";

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