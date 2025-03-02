import React, { useCallback } from "react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const useChildrenArray = (
  children: React.ReactNode
): [
  string[],
  React.ReactNode[],
  (oldIndex: number, newIndex: number) => void
] => {
  const [childIds, setChildIds] = React.useState<string[]>([]);
  const [sortedChildren, setSortedChildren] = React.useState<React.ReactNode[]>(
    []
  );
  const handleReorder = useCallback((oldIndex: number, newIndex: number) => {
    setSortedChildren((prev) => {
      const newArray = [...prev];
      const [removed] = newArray.splice(oldIndex, 1);
      newArray.splice(newIndex, 0, removed);
      return newArray;
    });

    setChildIds((prev) => {
      const newIds = [...prev];
      const [movedId] = newIds.splice(oldIndex, 1);
      newIds.splice(newIndex, 0, movedId);
      return newIds;
    });
  }, []);

  useEffect(() => {
    const childrenArray = React.Children.toArray(children);
    // console.log("childrenArray", childrenArray);
    if (childIds.length !== childrenArray.length) {
      const ids = childrenArray.map(() => uuidv4());
      setChildIds(ids);
    }
    setSortedChildren(childrenArray);
  }, [children, childIds.length]);
  return [childIds, sortedChildren, handleReorder];
};
