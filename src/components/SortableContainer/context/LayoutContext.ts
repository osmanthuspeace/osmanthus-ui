import { createContext } from "react";
import { LayoutContextProps } from "../interface";

const defaultContext: LayoutContextProps = {
  width: 100,
  height: 100,
  unitSize: 100,
  gridLayout: {
    columns: 2,
    rows: 4,
    gap: 50,
    paddingX: 0,
    paddingY: 0,
  },
};

const LayoutContext = createContext(defaultContext);
export default LayoutContext;
