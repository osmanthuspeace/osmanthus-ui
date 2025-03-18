import { ReactNode, useEffect, useState } from "react";
import CrossContainerContext, { ContainerRect } from "./CrossContainerContext";
import { Id } from "../../type";

export const CrossContainer = ({ children }: { children: ReactNode }) => {
  const [containerMap, setContainerMap] = useState<Map<Id, ContainerRect>>(
    new Map()
  );
  const updateContainerRect = (id: Id, rect: DOMRectReadOnly) => {
    setContainerMap((prev) => {
      const existing = prev.get(id);
      if (
        existing &&
        existing.top === rect.top &&
        existing.left === rect.left &&
        existing.width === rect.width &&
        existing.height === rect.height
      ) {
        return prev;
      }
      const newMap = new Map(prev);
      newMap.set(id, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      return newMap;
    });
  };
  return (
    <CrossContainerContext.Provider
      value={{
        sourceContainerId: null,
        targetContainerId: null,
        containerRegister: containerMap,
        updateContainerRect,
      }}
    >
      {children}
    </CrossContainerContext.Provider>
  );
};
