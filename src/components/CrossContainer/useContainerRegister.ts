import { useContext, useRef } from "react";
import CrossContainerContext from "./CrossContainerContext";
import { useLayoutUpdateEffect } from "../../hooks/useLayoutUpdateEffect";

export const useContainerRegister = (containerId: string) => {
  const { updateContainerRect } = useContext(CrossContainerContext);
  const containerRef = useRef<HTMLDivElement>(null);
  useLayoutUpdateEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      updateContainerRect(containerId, rect);
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [containerId, updateContainerRect]);
  return containerRef;
};
