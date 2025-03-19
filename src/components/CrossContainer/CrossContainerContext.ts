import { createContext } from "react";
import { Id } from "../../type";

export interface ContainerRect {
  top: number;
  left: number;
  width: number;
  height: number;
}
export interface CrossContainerContextProps {
  sourceContainerId: string | null;
  targetContainerId: string | null;
  containerRegister: Map<Id, ContainerRect>;
  updateContainerRect: (id: Id, rect: DOMRectReadOnly) => void;
}

const defaultContext: CrossContainerContextProps = {
  sourceContainerId: null,
  targetContainerId: null,
  containerRegister: new Map(),
  updateContainerRect: () => {},
};
const CrossContainerContext =
  createContext<CrossContainerContextProps>(defaultContext);
export default CrossContainerContext;
