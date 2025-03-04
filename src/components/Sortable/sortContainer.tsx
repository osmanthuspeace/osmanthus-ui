import SortableContext from "./sortableContext";
import { useComposeRef } from "../../hooks/useComposeRef";
import { useObserveContainer } from "./hooks/useObserveContainer";
import { useChildrenArray } from "./hooks/useChildrenArray";
import { useGridLayout } from "./hooks/useGridLayout";
import { useRenderedChildren } from "./hooks/useRenderedChildren";
import { forwardRef, useRef, useState } from "react";
import { SortContainerProps } from "./interface";
import { DraggingState } from "../Drag/interface";

const SortContainerInternal = (
  {
    children,
    width = 250,
    height = 550,
    unitSize = 100,
    gridTemplateColumns = 2,
    isActive = false,
    enableBorder = true,
    onOrderChange,
    onDragStart,
    onDrag,
    onDragEnd,
    ...rest
  }: SortContainerProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const [sortedChildren, handleReorder] = useChildrenArray(
    children,
    onOrderChange
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposeRef(
    containerRef,
    ref
  ) as React.RefObject<HTMLDivElement>;
  const [shouldClearTransform, setShouldClearTransform] = useState(false);
  const containerCoordinate = useObserveContainer(containerRef);

  const { computedGap, computedGridTemplateRows, containerPadding } =
    useGridLayout(width, height, unitSize, gridTemplateColumns);
  const [draggingState, setDraggingState] = useState<DraggingState>({
    activeIndex: null,
    overIndex: null,
    itemCount: 0,
  });
  const renderedChildren = useRenderedChildren(sortedChildren);

  return (
    <>
      <SortableContext.Provider
        value={{
          width,
          height,
          isActive,
          shouldClearTransform,
          setShouldClearTransform,
          unitSize: unitSize,
          containerCoordinate,
          gridLayout: {
            columns: gridTemplateColumns,
            rows: computedGridTemplateRows,
            gap: computedGap,
            padding: containerPadding,
          },
          onReorder: handleReorder,
          draggingState,
          setDraggingState,
          containerRef,
          enableBorder,
          onDragStart,
          onDrag,
          onDragEnd,
        }}
      >
        <div
          style={{
            display: "grid",
            width: `${width}px`,
            height: `${height}px`,
            gridTemplateRows: `repeat(${computedGridTemplateRows}, 1fr)`,
            gridTemplateColumns: `repeat(${gridTemplateColumns}, 1fr)`,
            gridGap: `${computedGap}px`,
            padding: `${computedGap}px`,
            margin: "0 auto",
          }}
          {...rest}
          ref={composedRef}
          className="drag-container"
        >
          {renderedChildren}
        </div>
      </SortableContext.Provider>
    </>
  );
};
const SortContainer = forwardRef<HTMLDivElement, SortContainerProps>(
  SortContainerInternal
);
export { SortContainer };
