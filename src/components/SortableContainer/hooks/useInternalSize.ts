import { RefObject, useEffect, useRef, useState } from "react";

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
  const containerSizeRef = useRef(containerSize);

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

      console.log(
        "触发了internalSize中的updateSize",
        newWidth,
        newHeight,
        containerSizeRef.current
      );
      const widthDelta = Math.abs(newWidth - containerSizeRef.current.width);
      const heightDelta = Math.abs(newHeight - containerSizeRef.current.height);
      //如果宽度和高度的变化小于10像素，则不更新，避免频繁更新，导致性能问题
      if (widthDelta < 5 && heightDelta < 5) return;

      setContainerSize({ width: newWidth, height: newHeight });
      containerSizeRef.current = { width: newWidth, height: newHeight };
    };

    const observer = new ResizeObserver(() => {
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
