import { createContext } from "react";
import { Id } from "../../type";
import { CrossInfo } from "./interface";
import { noop } from "../../utils/noop";

export interface ContainerRect {
  top: number;
  left: number;
  width: number;
  height: number;
}
export interface CrossContainerContextProps {
  sourceContainerId: string | null;
  targetContainerId: string | null;
  setSourceContainerId: (id: string | null) => void;
  setTargetContainerId: (id: string | null) => void;
  containerRegister: Map<Id, ContainerRect>;
  updateContainerMap: (id: Id, rect: DOMRectReadOnly) => void;
  getContainerCoordinateById: (id: Id) => {
    containerX: number;
    containerY: number;
  };
  onCross: (source: CrossInfo, target: CrossInfo) => void;
}

const defaultContext: CrossContainerContextProps = {
  sourceContainerId: null,
  targetContainerId: null,
  setSourceContainerId: () => {},
  setTargetContainerId: () => {},
  containerRegister: new Map(),
  updateContainerMap: () => {},
  getContainerCoordinateById: () => ({
    containerX: 0,
    containerY: 0,
  }),
  onCross: noop,
};
const CrossContainerContext =
  createContext<CrossContainerContextProps>(defaultContext);
export default CrossContainerContext;
