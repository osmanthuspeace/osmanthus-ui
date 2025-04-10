import { createContext } from "react";
import { Id } from "../../../type";

const defaultContext = {
  index: -1,
  containerId: null,
};
export interface SortableInfo {
  index: number;
  containerId: Id;
}
const IndexContext = createContext<SortableInfo>(defaultContext);
export default IndexContext;
