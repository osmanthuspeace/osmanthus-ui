import React from "react";
import { useMemo } from "react";

export const useRenderedChildren = (sortedChildren: React.ReactNode[]) => {
  return useMemo(() => {
    return sortedChildren.map((child, index) => {
      if (React.isValidElement(child)) {
        //这些属性会添加到SortableItem的props中
        return React.cloneElement(child, {
          ...child.props,
          index: index,
        });
      }
      return child;
    });
  }, [sortedChildren]);
};
