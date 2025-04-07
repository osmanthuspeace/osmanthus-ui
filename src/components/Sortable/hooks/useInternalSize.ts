import { RefObject, useEffect, useRef, useState } from "react";

export const useInternalSize = (
  width: number | undefined,
  height: number | undefined,
  containerRef: RefObject<HTMLDivElement>
) => {
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });
  const first = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && first.current) {
        const { width, height } = entry.contentRect;
        // console.log("width", width, "height", height);

        if (width !== containerSize.width || height !== containerSize.height) {
          setContainerSize({ width, height });
        }
        first.current = false;
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const internalWidth = width ?? containerSize.width;
  const internalHeight = height ?? containerSize.height;
  return {
    internalWidth,
    internalHeight,
  };
};
