import { createContext } from "react";
import { Id } from "../../type";
import { CrossInfo } from "./interface";

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
  containerRegister: new Map(),
  updateContainerMap: () => {},
  getContainerCoordinateById: () => ({
    containerX: 0,
    containerY: 0,
  }),
  onCross: () => {},
};
const CrossContainerContext =
  createContext<CrossContainerContextProps>(defaultContext);
export default CrossContainerContext;
