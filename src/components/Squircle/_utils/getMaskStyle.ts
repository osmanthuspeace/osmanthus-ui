import { CSSProperties } from "react";
import { getSquircleBorderAsDataUri, getSquircleMaskAsDataUri } from "./path";
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
  enableBorder?: boolean;
}
export function getMaskStyle(input: GetMaskStyleInput): CSSProperties {
  const { width, height, enableBorder } = input;

  const maxBorderRadius = Math.min(width, height) / 2;
  const { radius = maxBorderRadius, roundness = DEFAULT_RATIO } = input;

  const numberRadius = typeof radius === "string" ? maxBorderRadius : radius;

  const finalBorderRadius = Math.min(numberRadius, maxBorderRadius);
  const r1 = finalBorderRadius * roundness;
  const r2 = finalBorderRadius;
  const maskDataUri = getSquircleMaskAsDataUri(width, height, r1, r2);
  const borderDataUri = getSquircleBorderAsDataUri(width, height, r1, r2, 2);

  return {
    maskImage: `url("${maskDataUri}")`,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "100% 100%",
    WebkitMaskImage: `url("${maskDataUri}")`,
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "100% 100%",
    ...(enableBorder && { backgroundImage: `url("${borderDataUri}")` }),
  };
}
export const cachedGetMaskStyle = createCache(getMaskStyle, (input) => {
  const { width, height, radius, roundness } = input;
  return `${width}-${height}-${radius}-${roundness}`;
});
