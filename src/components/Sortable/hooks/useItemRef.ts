import { Ref, useContext, useEffect, useRef } from "react";
import SortableContext from "../context/sortableContext";
import { useComposeRef } from "../../../hooks/useComposeRef";

const useItemRef = (index: number, ref: Ref<HTMLDivElement>) => {
  const { registerItemRef } = useContext(SortableContext);

  const internalRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposeRef(ref, internalRef);

  useEffect(() => {
    if (internalRef.current) {
      registerItemRef(index, internalRef.current);
    }
    return () => {
      registerItemRef(index, null);
    };
  });
  return composedRef;
};
export default useItemRef;
