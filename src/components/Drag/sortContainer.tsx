import { forwardRef } from "react";

interface DragContainerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
  > {
  width?: number;
  height?: number;
  gridTemplateRows?: number;
  gridTemplateColumns?: number;
  gridGap?: number;
}
const SortContainerInternal = ({
  children,
  width = 250,
  height = 550,
  gridTemplateRows = 4,
  gridTemplateColumns = 2,
  gridGap = 50,
  ...rest
}: DragContainerProps) => {
  return (
    <>
      <div
        {...rest}
        style={{
          display: "grid",
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
const SortContainer = forwardRef<HTMLDivElement, DragContainerProps>(
  SortContainerInternal
);
export default SortContainer;
