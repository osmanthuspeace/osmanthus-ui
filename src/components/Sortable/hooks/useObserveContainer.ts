import { RefObject, useEffect, useState } from "react";
import { Coordinate } from "../../../type";

export const useObserveContainer = (
  containerRef: RefObject<HTMLDivElement>
) => {
  const [containerCooridnate, setContainerCooridnate] = useState<Coordinate>({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    if (!containerRef || !containerRef.current) {
      return;
    }
    const container = containerRef.current;
    const observer = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      setContainerCooridnate({
        x: rect.x,
        y: rect.y,
      });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);
  return containerCooridnate;
};
