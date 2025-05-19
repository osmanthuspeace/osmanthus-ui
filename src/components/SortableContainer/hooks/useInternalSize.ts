import { RefObject, useEffect, useState } from "react";
import { debounce } from "../../../utils/debounce";

//初始化时计算容器大小，如果有传入的width和height，则使用传入的值，否则使用auto的宽高
export const useInternalSize = (
  width: number | undefined,
  height: number | undefined,
  containerRef: RefObject<HTMLDivElement>
) => {
  const [containerSize, setContainerSize] = useState({
    width: width ?? 0,
    height: height ?? 0,
  });

  useEffect(() => {
    if (width !== undefined && height !== undefined) return;

    const container = containerRef.current;
    if (!container) return;
    const parent = container.parentElement;
    if (!parent) return;

    const updateSize = () => {
      const rect = parent.getBoundingClientRect();
      const newWidth = width ?? rect.width;
      const newHeight = height ?? rect.height;

      console.log("触发了internalSize中的updateSize", newWidth, newHeight);
      if (
        newWidth !== containerSize.width ||
        newHeight !== containerSize.height
      ) {
        setContainerSize({ width: newWidth, height: newHeight });
      }
    };

    const observer = new ResizeObserver(() => {
      // debounce(updateSize, 100);
      updateSize();
    });
    observer.observe(parent);

    updateSize();
    return () => {
      observer.disconnect();
    };
  }, [width, height]);

  const internalWidth = width ?? containerSize.width;
  const internalHeight = height ?? containerSize.height;

  return {
    internalWidth,
    internalHeight,
  };
};
