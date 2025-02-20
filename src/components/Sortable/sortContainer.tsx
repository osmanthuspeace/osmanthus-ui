import React, { useState } from "react";
import { forwardRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

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
  const [itemIds, setItemIds] = useState<string[]>([]);

  useEffect(() => {
    const ids = React.Children.map(children, () => uuidv4())!;
    setItemIds(ids);
  }, [children]);

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
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              id: itemIds[index],
              index,
            });
          }
          return child;
        })}
      </div>
    </>
  );
};
const SortContainer = forwardRef<HTMLDivElement, DragContainerProps>(
  SortContainerInternal
);
export default SortContainer;
