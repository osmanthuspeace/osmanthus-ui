import React from "react";
import { useMemo } from "react";
import IndexContext from "../context/indexContext";

export const useRenderedChildren = (sortedChildren: React.ReactNode[]) => {
  return useMemo(() => {
    return sortedChildren.map((child, index) => {
      if (!React.isValidElement(child)) return child;
      const childKey = child.props.id || child.key || index;
      return (
        <IndexContext.Provider key={childKey} value={index}>
          {child}
        </IndexContext.Provider>
      );
    });
  }, [sortedChildren]);
};
