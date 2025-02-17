import { forwardRef } from "react";
import { cachedGetMaskStyle } from "./_utils/getMaskStyle";

interface SquircleProps extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  ref?: React.Ref<HTMLDivElement>;
  radius?: number | "auto";
  roundness?: number;
}

const Squircle = forwardRef<HTMLDivElement, SquircleProps>(
  (
    {
      children,
      width,
      height,
      className,
      radius,
      roundness,
      style,
      ...restProps
    },
    ref
  ) => {
    return (
      <>
        <div
          className={className}
          ref={ref}
          {...restProps}
          style={{
            ...cachedGetMaskStyle({ width, height, radius, roundness }),
            maskPosition: "center",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            ...(style || {}),
            width: `${width}px`,
            height: `${height}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 0 0 2px black", // 使用 box-shadow 代替边框
          }}
        >
          {children}
        </div>
      </>
    );
  }
);
export default Squircle;
