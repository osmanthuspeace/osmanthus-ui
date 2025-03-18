import { createContext } from "react";

const defaultContext = -1;

const IndexContext = createContext<number>(defaultContext);
export default IndexContext;
