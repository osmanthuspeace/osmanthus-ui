import { useContext, useEffect, useRef } from "react";
import SortableProviderContext from "../context/SortableProviderContext";
import { GridLayout } from "../../SortableContainer/interface";

export const useContainerRegister = (
  containerId: string,
  childrenLength: number,
  gridLayout: GridLayout
) => {
  const { updateContainerMap } = useContext(SortableProviderContext);
  // console.log(
  //   `[DEBUG] Component mounted with containerId: ${containerId}`,
  //   gridLayout
  // );
  const containerRef = useRef<HTMLDivElement>(null);
  const prevInfo = useRef({
    childrenLength: childrenLength,
    gridLayout: gridLayout,
    rect: {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
  });

  const updateInfo = () => {
    prevInfo.current.childrenLength = childrenLength;
    prevInfo.current.gridLayout = gridLayout;
    updateContainerMap(containerId, {
      rect: prevInfo.current.rect,
      childrenLength: childrenLength,
      gridLayout: gridLayout,
    });
    return;
  };

  // 当容器的rect发生变化时，更新containerMap
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      prevInfo.current.rect = rect;
      updateContainerMap(containerId, {
        rect,
        childrenLength: prevInfo.current.childrenLength,
        gridLayout: prevInfo.current.gridLayout,
      });
    });

    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [containerId, updateContainerMap]);

  // 当初次渲染和childrenLength发生变化时，更新containerMap
  useEffect(() => {
    if (childrenLength > 0) {
      updateInfo();
    }
  }, [childrenLength]);

  useEffect(() => {
    if (gridLayout) {
      updateInfo();
    }
  }, [gridLayout]);

  return containerRef;
};
