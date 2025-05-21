import { RefObject, useLayoutEffect, useRef } from "react";

//初始化时计算容器大小，如果有传入的width和height，则使用传入的值，否则使用auto的宽高
export const useInternalSize = (
  width: number | undefined,
  height: number | undefined,
  containerRef: RefObject<HTMLDivElement>
) => {
  const containerSizeRef = useRef({
    width:
      containerRef.current?.parentElement?.getBoundingClientRect().width ?? 0,
    height:
      containerRef.current?.parentElement?.getBoundingClientRect().width ?? 0,
  });

  useLayoutEffect(() => {
    if (width !== undefined && height !== undefined) return;

    const container = containerRef.current;
    if (!container) return;
    const parent = container.parentElement;
    if (!parent) return;
    const observer = new ResizeObserver(() => {
      const rect = parent.getBoundingClientRect();
      // TODO: 一旦容器有margin等属性，这里的计算就会出错导致无限调用
      containerSizeRef.current = {
        width: rect.width - 2,
        height: rect.height - 2,
      };
    });
    observer.observe(parent);
    return () => {
      observer.disconnect();
    };
  });

  const internalWidth = width ?? containerSizeRef.current.width;
  const internalHeight = height ?? containerSizeRef.current.height;

  return {
    internalWidth,
    internalHeight,
  };
};
