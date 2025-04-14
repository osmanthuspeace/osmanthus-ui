import { Id } from "../../type";

// =============SortableItem================
export interface SortableItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  id?: Id;
  index?: number;
  width?: number;
  height?: number;
  enableBorder?: boolean;
  flipBack?: React.ReactNode;
}
export interface ISortableItem {
  id: Id;
  children: React.ReactNode;
}
export type SortableItems = ISortableItem[];

