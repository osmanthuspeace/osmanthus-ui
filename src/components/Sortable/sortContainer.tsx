import React, { useMemo, useRef, useState } from "react";
import { forwardRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import SortableContext from "./sortableContext";

interface DragContainerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
  > {
  width?: number;
  height?: number;
  unitSize?: number;
  gridTemplateRows?: number;
  gridTemplateColumns?: number;
  gridGap?: number;
  isActive?: boolean;
}
export interface DraggingState {
  activeIndex: number | null;
  overIndex: number | null;
  itemCount: number;
}
const SortContainerInternal = ({
  children,
  width = 250,
  height = 550,
  unitSize = 100,
  gridTemplateRows = 4,
  gridTemplateColumns = 2,
  gridGap = 50,
  isActive = false,
  ...rest
}: DragContainerProps) => {
  const [childIds, setChildIds] = useState<string[]>([]);
  const [sortedChildren, setSortedChildren] = useState<React.ReactNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerPadding = gridGap;
  const [draggingState, setDraggingState] = useState<DraggingState>({
    activeIndex: null,
    overIndex: null,
    itemCount: 0,
  });
  useEffect(() => {
    const childrenArray = React.Children.toArray(children);
    // console.log("childrenArray", childrenArray);

    //仅在长度变化时生成新key
    if (childIds.length !== childrenArray.length) {
      const ids = childrenArray.map(() => uuidv4());
      setChildIds(ids);
    }
    setSortedChildren(childrenArray);
  }, [children, childIds.length]);

  const handleReorder = (oldIndex: number, newIndex: number) => {
    console.log("handleReorder");

    // console.log("Reordering from", oldIndex, "to", newIndex);

    setSortedChildren((prev) => {
      const newArray = [...prev];
      const [removed] = newArray.splice(oldIndex, 1);
      newArray.splice(newIndex, 0, removed);

      return newArray;
    });
    //同步更新key
    setChildIds((prev) => {
      // console.log("prev", prev);

      const newIds = [...prev];
      const [movedId] = newIds.splice(oldIndex, 1);
      newIds.splice(newIndex, 0, movedId);
      // console.log("newIds", newIds);
      return newIds;
    });
  };

  const renderedChildren = () => {
    // console.log("renderedChildren", sortedChildren);

    return sortedChildren.map((child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...child.props,
          key: childIds[index],
          id: childIds[index],
          index,
        });
      }
      return child;
    });
  };

  return (
    <>
      <SortableContext.Provider
        value={{
          width,
          height,
          isActive,
          unitSize: unitSize,
          gridLayout: {
            columns: gridTemplateColumns,
            rows: gridTemplateRows,
            gap: gridGap,
            padding: containerPadding,
          },
          onReorder: handleReorder,
          draggingState,
          setDraggingState,
          containerRef,
        }}
      >
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
          {renderedChildren()}
        </div>
      </SortableContext.Provider>
    </>
  );
};
const SortContainer = forwardRef<HTMLDivElement, DragContainerProps>(
  SortContainerInternal
);
export default SortContainer;
