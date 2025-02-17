import { forwardRef } from "react";
import { cachedGetMaskStyle } from "./_utils/getMaskStyle";
import clsx from "clsx";
interface SquircleProps extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  ref?: React.Ref<HTMLDivElement>;
  radius?: number | "auto";
  roundness?: number;
  enableBorder?: boolean;
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
      enableBorder = true,
      ...restProps
    },
    ref
  ) => {
    return (
      <>
        <div
          className={clsx(className, "squircle-container")}
          ref={ref}
          {...restProps}
          style={{
            ...cachedGetMaskStyle({
              width,
              height,
              radius,
              roundness,
              enableBorder,
            }),
            maskPosition: "center",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            ...(style || {}),
            width: `${width}px`,
            height: `${height}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "aliceblue",
          }}
        >
          {children}
        </div>
      </>
    );
  }
);
export default Squircle;
