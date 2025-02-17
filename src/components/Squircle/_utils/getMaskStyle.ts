import { CSSProperties } from "react";
import { getSquirclePathAsDataUri } from "./path";
export const iOSPreset = {
  r1: 0.0586,
  r2: 0.332,
};
export const DEFAULT_RATIO = iOSPreset.r1 / iOSPreset.r2;

const createCache = <T, Args extends any[]>(
  getter: (...args: Args) => T,
  argsSerializer: (...input: Args) => string
) => {
  const cacheMap = new Map<string, T>();

  return function getWithCache(...args: Args) {
    const serializedArgs = argsSerializer(...args);

    const cachedValue = cacheMap.get(serializedArgs);

    if (cachedValue) {
      return cachedValue;
    }

    const newValue = getter(...args);

    cacheMap.set(serializedArgs, newValue);

    return newValue;
  };
};

interface GetMaskStyleInput {
  width: number;
  height: number;
  radius?: number | "auto";
  roundness?: number;
}
export function getMaskStyle(input: GetMaskStyleInput): CSSProperties {
  const { width, height } = input;

  const maxBorderRadius = Math.min(width, height) / 2;
  const { radius = maxBorderRadius, roundness = DEFAULT_RATIO } = input;

  const numberRadius = typeof radius === "string" ? maxBorderRadius : radius;

  const finalBorderRadius = Math.min(numberRadius, maxBorderRadius);

  const dataUri = getSquirclePathAsDataUri(
    width,
    height,
    finalBorderRadius * roundness,
    finalBorderRadius
  );

  return {
    maskImage: `url("${dataUri}")`,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskImage: `url("${dataUri}")`,
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
  };
}
export const cachedGetMaskStyle = createCache(getMaskStyle, (input) => {
  const { width, height, radius, roundness } = input;
  return `${width}-${height}-${radius}-${roundness}`;
});
