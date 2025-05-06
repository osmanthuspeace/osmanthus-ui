import { useContext, useEffect, useRef } from "react";
import { ContainerRect } from "../interface";
import SortableProviderContext from "../context/SortableProviderContext";
import { GridLayout } from "../../SortableContainer/interface";

export const useContainerRegister = (
  containerId: string,
  childrenLength: number,
  gridLayout: GridLayout
) => {
  const { updateContainerMap } = useContext(SortableProviderContext);
  // console.log(`[DEBUG] Component mounted with containerId: ${containerId}`);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevInfo = useRef({
    childrenLength: childrenLength,
    gridLayout: gridLayout,
    rect: null as unknown as ContainerRect,
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
    // console.log("[DEBUG] Effect triggered");
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

  return containerRef;
};
