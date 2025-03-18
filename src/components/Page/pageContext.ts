import { createContext } from "react";

export interface PageContextProps {

}

const defaultContext = {};
//负责左右滑动的逻辑
const PageContext = createContext(defaultContext);
export default PageContext;
