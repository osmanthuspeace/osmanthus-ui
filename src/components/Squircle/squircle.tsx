import { forwardRef, useContext } from "react";
import { cachedGetMaskStyle } from "./_utils/getMaskStyle";
import { Badge } from "../Badge/badge";
import SortableContext from "../Sortable/context/sortableContext";
import clsx from "../../utils/clsx";
interface SquircleInternalProps extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  ref?: React.Ref<HTMLDivElement>;
  radius?: number | "auto";
  roundness?: number;
  enableBorder?: boolean;
}

const SquircleRefRenderFunction: React.ForwardRefRenderFunction<
  HTMLDivElement,
  SquircleInternalProps
> = (props, ref) => {
  const {
    children,
    width,
    height,
    className,
    radius,
    roundness,
    style,
    enableBorder = true,
    ...restProps
  } = props;

  return (
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
  );
};

const SquircleInternal = forwardRef<HTMLDivElement, SquircleInternalProps>(
  SquircleRefRenderFunction
);

export interface SquircleProps extends React.HTMLAttributes<HTMLDivElement> {
  enableBorder?: boolean;
}

const Squircle = (props: SquircleProps) => {
  const { children, enableBorder } = props;
  const { enableDnd, unitSize } = useContext(SortableContext);

  return (
    <Badge visible={enableDnd}>
      <SquircleInternal
        width={unitSize}
        height={unitSize}
        radius="auto"
        roundness={0}
        enableBorder={enableBorder}
      >
        {children}
      </SquircleInternal>
    </Badge>
  );
};

export { Squircle };
