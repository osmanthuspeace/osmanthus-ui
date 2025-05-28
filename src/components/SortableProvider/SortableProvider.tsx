import { ReactNode, useCallback, useMemo, useReducer, useState } from "react";
import { Id } from "../../type";
import { ContainerInfo, CrossInfo } from "./interface";
import SortableProviderContext from "./context/SortableProviderContext";
import DragContext from "./context/DragContext";
import { dragReducer, initialDraggingState } from "./util/reducer";

// 用于包裹所有的容器，提供跨容器拖拽的上下文
export const SortableProvider = ({
  children,
  onCross,
}: {
  children: ReactNode;
  onCross?: (source: CrossInfo, target: CrossInfo) => void;
}) => {
  const [containerMap, setContainerMap] = useState<Map<Id, ContainerInfo>>(
    new Map()
  );

  const [draggingState, dispatch] = useReducer(
    dragReducer,
    initialDraggingState
  );
  const [isDragEnded, setIsDragEnded] = useState(true);
  const dragValue = {
    draggingState,
    dispatch,
    isDragEnded,
    setIsDragEnded,
  };
  const updateContainerMap = useCallback(
    (id: Id, containerInfo: ContainerInfo) => {
      const { rect, childrenLength, gridLayout } = containerInfo;
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
          gridLayout,
        });
        return newMap;
      });
    },
    []
  );

  const getContainerInfoById = useCallback(
    (id: Id) => {
      const containerInfo = containerMap.get(id);
      // console.log("通过id获取container的信息", id, containerInfo);
      if (containerInfo) {
        return containerInfo;
      } else {
        throw new Error(`Container with id ${id} not found`);
      }
    },
    [containerMap]
  );

  const value = useMemo(() => {
    return {
      onCross,
      containerRegister: containerMap,
      updateContainerMap,
      getContainerInfoById,
    };
  }, [containerMap, getContainerInfoById, onCross, updateContainerMap]);

  return (
    <SortableProviderContext.Provider value={value}>
      <DragContext.Provider value={dragValue}>
        <div>{children}</div>
      </DragContext.Provider>
    </SortableProviderContext.Provider>
  );
};
