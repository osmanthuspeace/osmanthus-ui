import { Id } from "../../type";

// =============SortableItem================
interface SortableItemPropsBase
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  id?: Id;
  index?: number;
  width?: number;
  height?: number;
  enableBorder?: boolean;
}
export type SortableItemProps = SortableItemPropsBase &
  (
    | {
        enableFlip: true;
        flipBack: React.ReactNode;
      }
    | {
        enableFlip?: false;
        flipBack?: never;
      }
  );
export interface ISortableItem {
  id: Id;
  children: React.ReactNode;
}
export type SortableItems = ISortableItem[];
