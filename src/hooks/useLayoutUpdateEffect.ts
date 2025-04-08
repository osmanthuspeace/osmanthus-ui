import { useEffect, useLayoutEffect, useRef } from "react";

const useInternalLayoutEffect = (
  callback: (mounted: boolean) => void | VoidFunction,
  deps?: React.DependencyList
) => {
  const firstMountRef = useRef(true);
  useLayoutEffect(() => {
    return callback(firstMountRef.current);
  }, deps);
  useLayoutEffect(() => {
    firstMountRef.current = false;
    return () => {
      firstMountRef.current = true;
    };
  }, []);
};
// 只在第一次渲染时执行
export const useLayoutUpdateEffect: typeof useEffect = (callback, deps) => {
  useInternalLayoutEffect((firstMount) => {
    if (firstMount) {
      return callback();
    }
  }, deps);
};
// 跳过第一次渲染
export const useEffectSkipFirst: typeof useEffect = (
  callback,
  deps
) => {
  useInternalLayoutEffect((firstMount) => {
    if (!firstMount) {
      return callback();
    }
  }, deps);
};
