import React, { useCallback, useRef } from "react";
import { useEffect } from "react";

export const useChildrenArray = (
  children: React.ReactNode,
  onOrderChange?: (newOrderIds: string[]) => void
): [
  React.ReactNode[],
  (oldIndex: number, newIndex: number, activeIndex: number) => void,
  (index: number, ref: HTMLElement | null) => void
] => {
  const [sortedChildren, setSortedChildren] = React.useState<React.ReactNode[]>(
    []
  );
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  const getChildIds = (children: React.ReactNode[]): string[] => {
    return children
      .map((child) =>
        React.isValidElement(child) ? String(child.props.id || "") : ""
      )
      .filter(Boolean);
  };

  const handleReorder = useCallback(
    (oldIndex: number, newIndex: number, activeIndex: number) => {
      setSortedChildren((prev) => {
        const newArray = [...prev];
        const [removed] = newArray.splice(oldIndex, 1);
        newArray.splice(newIndex, 0, removed);
        requestAnimationFrame(() => {
          itemRefs.current.forEach((item) => {
            item.style.transform = "none";

            if (oldIndex !== activeIndex) {
              item.style.transform = "none";
            }
          });
          onOrderChange?.(getChildIds(newArray));
        });
        return newArray;
      });
    },
    [onOrderChange]
  );

  useEffect(() => {
    const childrenArray = React.Children.toArray(children);
    setSortedChildren(childrenArray);
  }, [children]);

  const registerItemRef = useCallback(
    (index: number, ref: HTMLElement | null) => {
      if (ref) {
        itemRefs.current.set(index, ref);
      } else {
        itemRefs.current.delete(index);
      }
    },
    []
  );

  return [sortedChildren, handleReorder, registerItemRef];
};
