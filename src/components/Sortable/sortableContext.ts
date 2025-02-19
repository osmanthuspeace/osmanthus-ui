import { createContext } from "react";

const defaultContext = {
  width: 100,
  height: 100,
  isActive: false,
};

const SortableContext = createContext(defaultContext);
export default SortableContext;
