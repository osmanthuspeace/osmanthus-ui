import { RefObject, useEffect, useState } from "react";
import { Coordinate } from "../../../type";

// 监听container的尺寸变化，获取最新的container坐标
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

    const observer = new ResizeObserver((entries) => {
      // console.log("触发了resizeObserver");
      const rect = entries[0].target.getBoundingClientRect();
      // console.log('Consistent rect:', rect);
      setContainerCooridnate({
        x: rect.x,
        y: rect.y,
      });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  // useEffect(() => {
  //   console.log("containerCooridnate", containerCooridnate);
  // }, [containerCooridnate]);

  return containerCooridnate;
};
