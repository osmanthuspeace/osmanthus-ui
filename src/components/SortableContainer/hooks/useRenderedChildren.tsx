import React from "react";
import { useMemo } from "react";
import IndexContext from "../../SortableItem/context/indexContext";
import { Id } from "../../../type";

export const useRenderedChildren = (
  sortedChildren: React.ReactNode[],
  containerId: Id
) => {
  return useMemo(() => {
    return sortedChildren.map((child, index) => {
      if (!React.isValidElement(child)) return child;
      const childKey = child.props.id || child.key || index;
      const value = {
        index,
        containerId,
      };
      return (
        <IndexContext.Provider key={childKey} value={value}>
          {child}
        </IndexContext.Provider>
      );
    });
  }, [sortedChildren]);
};
