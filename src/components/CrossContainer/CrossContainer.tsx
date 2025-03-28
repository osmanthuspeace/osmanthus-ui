import { ReactNode, useCallback, useMemo, useState } from "react";
import CrossContainerContext, { ContainerRect } from "./CrossContainerContext";
import { Id } from "../../type";
import { CrossInfo } from "./interface";

export const CrossContainer = ({
  children,
  onCross,
}: {
  children: ReactNode;
  onCross: (source: CrossInfo, target: CrossInfo) => void;
}) => {
  const [containerMap, setContainerMap] = useState<Map<Id, ContainerRect>>(
    new Map()
  );
  const updateContainerMap = useCallback((id: Id, rect: DOMRectReadOnly) => {
    // console.warn("[DEBUG] enter updateContainerMap");

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
  }, []);

  const getContainerCoordinateById = useCallback(
    (id: Id) => {
      const rect = containerMap.get(id)!;
      if (rect) {
        return {
          containerX: rect.left,
          containerY: rect.top,
        };
      } else {
        throw new Error(`Container with id ${id} not found`);
      }
    },
    [containerMap]
  );

  const value = useMemo(
    () => ({
      onCross,
      sourceContainerId: null,
      targetContainerId: null,
      containerRegister: containerMap,
      updateContainerMap,
      getContainerCoordinateById,
    }),
    [containerMap, getContainerCoordinateById, onCross, updateContainerMap]
  );
  return (
    <CrossContainerContext.Provider value={value}>
      {children}
    </CrossContainerContext.Provider>
  );
};
