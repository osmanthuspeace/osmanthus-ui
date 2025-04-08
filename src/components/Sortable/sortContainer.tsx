import SortableContext from "./context/sortableContext";
import { useComposeRef } from "../../hooks/useComposeRef";
import { useObserveContainer } from "./hooks/useObserveContainer";
import { useChildrenArray } from "./hooks/useChildrenArray";
import { useGridLayout } from "./hooks/useGridLayout";
import { forwardRef, useRef, useState } from "react";
import { SortContainerProps } from "./interface";
import { DraggingState } from "../Drag/interface";
import { useRenderedChildren } from "./hooks/useRenderedChildren";
import { useContainerRegister } from "../CrossContainer/hooks/useContainerRegister";
import "./sortContainer.css";
import { useInternalSize } from "./hooks/useInternalSize";
const SortContainerInternal = (
  props: SortContainerProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    id,
    children,
    width,
    height,
    unitSize = 100,
    gridTemplateColumns = 2,
    enableDnd = false,
    onOrderChange,
    onDragStart,
    onAnyDrag: onDrag,
    onDragEnd,
    ...rest
  } = props;

  const [sortedChildren, handleReorder, registerItemRef] = useChildrenArray(
    children,
    onOrderChange
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const refInContext = useContainerRegister(id);
  const composedRef = useComposeRef(
    refInContext,
    containerRef,
    ref
  ) as React.RefObject<HTMLDivElement>;

  const containerCoordinate = useObserveContainer(containerRef);

  const { internalWidth, internalHeight } = useInternalSize(
    width,
    height,
    containerRef
  );

  const { computedGap, computedGridTemplateRows, containerPadding } =
    useGridLayout(
      internalWidth,
      internalHeight,
      unitSize,
      gridTemplateColumns,
      sortedChildren.length
    );

  const [draggingState, setDraggingState] = useState<DraggingState>({
    activeIndex: null,
    activeContainerId: id,
    overIndex: null,
    overContainerId: null,
    isDragTransitionEnd: true,
  });
  const renderedChildren = useRenderedChildren(sortedChildren);
  // const renderCount = useRef(0);

  // useEffect(() => {
  //   console.log(`Context更新次数: ${++renderCount.current}`);
  //   performance.mark("contextUpdate");
  // });
  return (
    <>
      <SortableContext.Provider
        value={{
          id,
          width: internalWidth,
          height: internalHeight,
          enableDnd,
          unitSize: unitSize,
          containerCoordinate,
          gridLayout: {
            columns: gridTemplateColumns,
            rows: computedGridTemplateRows,
            gap: computedGap,
            padding: containerPadding,
          },
          onReorder: handleReorder,
          registerItemRef,
          draggingState,
          setDraggingState,
          containerRef,
          onDragStart,
          onDrag,
          onDragEnd,
        }}
      >
        <div
          style={{
            display: "grid",
            width: width ? `${width}px` : `100%`,
            height: height ? `${height}px` : `100%`,
            gridTemplateRows: `repeat(${computedGridTemplateRows}, 1fr)`,
            gridTemplateColumns: `repeat(${gridTemplateColumns}, 1fr)`,
            gridGap: `${computedGap}px`,
            padding: `${computedGap}px`,
            border: "1px solid red",
            boxSizing: "border-box",
          }}
          {...rest}
          ref={composedRef}
          className="sort-container"
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
