import SortableContext from "./context/sortableContext";
import { useComposeRef } from "../../hooks/useComposeRef";
import { useObserveContainer } from "./hooks/useObserveContainer";
import { useChildrenArray } from "./hooks/useChildrenArray";
import { useGridLayout } from "./hooks/useGridLayout";
import { forwardRef, useMemo, useRef } from "react";
import { useRenderedChildren } from "./hooks/useRenderedChildren";
import { useContainerRegister } from "../SortableProvider/hooks/useContainerRegister";
import "./sortContainer.css";
import { useInternalSize } from "./hooks/useInternalSize";
import LayoutContext from "./context/LayoutContext";
import { SortContainerProps } from "./interface";
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
  const gridLayout = useMemo(
    () => ({
      columns: gridTemplateColumns,
      rows: computedGridTemplateRows,
      gap: computedGap,
      padding: containerPadding,
    }),
    [
      gridTemplateColumns,
      computedGridTemplateRows,
      computedGap,
      containerPadding,
    ]
  );
  const refInContext = useContainerRegister(
    id,
    sortedChildren.length,
    gridLayout
  );
  const composedRef = useComposeRef(
    refInContext,
    containerRef,
    ref
  ) as React.RefObject<HTMLDivElement>;

  const renderedChildren = useRenderedChildren(sortedChildren, id);
  // const renderCount = useRef(0);

  // useEffect(() => {
  //   console.log(`Context更新次数: ${++renderCount.current}`);
  //   performance.mark("contextUpdate");
  // });

  const layoutValue = {
    width: internalWidth,
    height: internalHeight,
    unitSize: unitSize,
    gridLayout: gridLayout,
  };

  const sortValue = {
    containerId: id,
    enableDnd,
    containerCoordinate,
    onReorder: handleReorder,
    registerItemRef,
    containerRef,
    onDragStart,
    onDrag,
    onDragEnd,
  };

  return (
    <>
      <LayoutContext.Provider value={layoutValue}>
        <SortableContext.Provider value={sortValue}>
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
      </LayoutContext.Provider>
    </>
  );
};
const SortContainer = forwardRef<HTMLDivElement, SortContainerProps>(
  SortContainerInternal
);
export { SortContainer };
