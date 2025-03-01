import React, { useMemo, useRef, useState } from "react";
import { forwardRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import SortableContext from "./sortableContext";
import { useComposeRef } from "../../utils/ref";

interface SortContainerProps
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
export interface SortableItemState {
  id: string;
  index: number;
  content: React.ReactNode;
}
const SortContainerInternal = (
  {
    children,
    width = 250,
    height = 550,
    unitSize = 100,
    gridTemplateRows = 4,
    gridTemplateColumns = 2,
    gridGap = 50,
    isActive = false,
    ...rest
  }: SortContainerProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const [childIds, setChildIds] = useState<string[]>([]);
  const [sortedChildren, setSortedChildren] = useState<React.ReactNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposeRef(
    containerRef,
    ref
  ) as React.RefObject<HTMLDivElement>;
  const [isMoved, setIsMoved] = useState(false);
  const [shouldClearTransform, setShouldClearTransform] = useState(false);
  const [containerCooridnate, setContainerCooridnate] = useState({
    x: 0,
    y: 0,
  });
  const containerPadding = gridGap;
  const [draggingState, setDraggingState] = useState<DraggingState>({
    activeIndex: null,
    overIndex: null,
    itemCount: 0,
  });
  const [isStart, setIsStart] = useState(false);
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

  useEffect(() => {
    if (!composedRef) {
      throw new Error("containerRef is null");
    }
    const observer = new ResizeObserver(() => {
      if (composedRef.current) {
        const { x, y } = composedRef.current.getBoundingClientRect();
        setContainerCooridnate({ x, y });
      }
    });
    if (composedRef.current) {
      observer.observe(composedRef.current);
    }
    return () => observer.disconnect();
  }, [composedRef]);

  const handleReorder = (oldIndex: number, newIndex: number) => {
    console.log("!!!!!!!handleReorder");
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

  const renderedChildren = useMemo(() => {
    return sortedChildren.map((child, index) => {
      if (React.isValidElement(child)) {
        //这些属性会添加到SortableItem的props中
        return React.cloneElement(child, {
          ...child.props,
          key: childIds[index],
          id: childIds[index],
          index: index,
        });
      }
      return child;
    });
  }, [childIds, sortedChildren]);

  return (
    <>
      <SortableContext.Provider
        value={{
          width,
          height,
          isActive,
          isMoved,
          setIsMoved,
          isStart,
          setIsStart,
          shouldClearTransform,
          setShouldClearTransform,
          unitSize: unitSize,
          containerCooridnate,
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
            margin: "0 auto",
          }}
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
