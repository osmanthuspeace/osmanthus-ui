import { forwardRef } from "react";

interface DragContainerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
  > {
  width: number;
  height: number;
  gridTemplateRows: number;
  gridTemplateColumns: number;
  gridGap: number;
}
const DragContainerInternal = ({
  children,
  width,
  height,
  gridTemplateRows,
  gridTemplateColumns,
  gridGap,
  ...rest
}: DragContainerProps) => {
  return (
    <>
      <div
        {...rest}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          gridTemplateRows: `repeat(${gridTemplateRows}, 1fr)`,
          gridTemplateColumns: `repeat(${gridTemplateColumns}, 1fr)`,
          gridGap: `${gridGap}px`,
          padding: `${gridGap}px`,
        }}
        className="drag-container"
      >
        {children}
      </div>
    </>
  );
};
const DragContainer = forwardRef<HTMLDivElement, DragContainerProps>(
  DragContainerInternal
);
export default DragContainer;
