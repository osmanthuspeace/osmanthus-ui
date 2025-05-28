import { createContext } from "react";
import { Id } from "../../../type";
import { ContainerInfo, CrossInfo } from "../interface";
import { noop } from "../../../utils/noop";

export interface SortableProviderContextProps {
  containerRegister: Map<Id, ContainerInfo>;
  updateContainerMap: (id: Id, info: ContainerInfo) => void;
  getContainerInfoById: (id: Id) => ContainerInfo;
  onCross?: (source: CrossInfo, target: CrossInfo) => void;
}

const defaultContext: SortableProviderContextProps = {
  containerRegister: new Map(),
  updateContainerMap: () => {},
  getContainerInfoById: (id: Id): ContainerInfo => {
    return defaultContext.containerRegister.get(id) || ({} as ContainerInfo);
  },
  onCross: noop,
};
const SortableProviderContext =
  createContext<SortableProviderContextProps>(defaultContext);
export default SortableProviderContext;
