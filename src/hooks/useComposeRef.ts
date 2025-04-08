//让ref指向正确的元素
export const fillRef = <T>(ref: React.Ref<T>, node: T) => {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref && typeof ref === "object" && "current" in ref) {
    (ref as any).current = node;
  }
};

export const useComposeRef = <T>(...refs: React.Ref<T>[]): React.Ref<T> => {
  const refList = refs.filter(Boolean); //过滤掉 null 或 undefined
  if (refList.length <= 1) {
    return refList[0];
  }
  return (node: T) => {
    //让每一个ref都指向同一个元素
    refs.forEach((ref) => {
      fillRef(ref, node);
    });
  };
};
