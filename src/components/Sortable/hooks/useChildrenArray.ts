import React, { useCallback } from "react";
import { useEffect } from "react";

export const useChildrenArray = (
  children: React.ReactNode,
  onOrderChange?: (newOrderIds: string[]) => void
): [React.ReactNode[], (oldIndex: number, newIndex: number) => void] => {
  const [sortedChildren, setSortedChildren] = React.useState<React.ReactNode[]>(
    []
  );
  const getChildIds = (children: React.ReactNode[]): string[] => {
    return children
      .map((child) =>
        React.isValidElement(child) ? String(child.props.id || "") : ""
      )
      .filter(Boolean);
  };
  const handleReorder = useCallback(
    (oldIndex: number, newIndex: number) => {
      setSortedChildren((prev) => {
        const newArray = [...prev];
        const [removed] = newArray.splice(oldIndex, 1);
        newArray.splice(newIndex, 0, removed);
        if (onOrderChange) {
          const currentIds = getChildIds(newArray);
          onOrderChange(currentIds);
        }
        return newArray;
      });
    },
    [onOrderChange]
  );

  useEffect(() => {
    const childrenArray = React.Children.toArray(children);
    setSortedChildren(childrenArray);
  }, [children]);
  return [sortedChildren, handleReorder];
};
