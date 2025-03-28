import { useContext, useEffect, useRef } from "react";
import CrossContainerContext from "../CrossContainerContext";

export const useContainerRegister = (containerId: string) => {
  const { updateContainerMap } = useContext(CrossContainerContext);
  // console.log(`[DEBUG] Component mounted with containerId: ${containerId}`);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    // console.log("[DEBUG] Effect triggered");

    if (!container) return;
    const observer = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      // console.log("id", containerId, "rect", rect);
      updateContainerMap(containerId, rect);
    });

    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [containerId, updateContainerMap]);
  return containerRef;
};
