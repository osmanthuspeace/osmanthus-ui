import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import SortableProviderContext from "./SortableProviderContext";
import { Id } from "../../type";
import { ContainerInfo, CrossInfo } from "./interface";

// 用于包裹所有的容器，提供跨容器拖拽的上下文
export const SortableProvider = ({
  children,
  onCross,
  crossMap,
}: {
  children: ReactNode;
  onCross: (source: CrossInfo, target: CrossInfo) => void;
  crossMap?: {
    [key: string]: [any[], (items: any[]) => void];
  };
}) => {
  const [containerMap, setContainerMap] = useState<Map<Id, ContainerInfo>>(
    new Map()
  );

  const [sourceContainerId, setSourceContainerId] = useState<Id>(null);
  const [targetContainerId, setTargetContainerId] = useState<Id>(null);

  const updateContainerMap = useCallback(
    (id: Id, containerInfo: ContainerInfo) => {
      // console.warn("[DEBUG] enter updateContainerMap");

      const { rect, childrenLength } = containerInfo;
      // console.log("rect", rect, "childrenLength", childrenLength);

      setContainerMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(id, {
          childrenLength: childrenLength,
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
        });
        return newMap;
      });
    },
    []
  );

  const getContainerInfoById = useCallback(
    (id: Id) => {
      const containerInfo = containerMap.get(id);
      if (containerInfo) {
        return containerInfo;
      } else {
        throw new Error(`Container with id ${id} not found`);
      }
    },
    [containerMap]
  );

  useEffect(() => {
    console.log("containerMap", containerMap);
  }, [containerMap]);

  const value = useMemo(() => {
    return {
      onCross,
      sourceContainerId: sourceContainerId,
      targetContainerId: targetContainerId,
      setSourceContainerId,
      setTargetContainerId,
      containerRegister: containerMap,
      updateContainerMap,
      getContainerInfoById,
    };
  }, [
    sourceContainerId,
    targetContainerId,
    containerMap,
    getContainerInfoById,
    onCross,
    updateContainerMap,
  ]);
  return (
    <SortableProviderContext.Provider value={value}>
      {children}
    </SortableProviderContext.Provider>
  );
};
