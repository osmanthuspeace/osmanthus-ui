export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate = true
) => {
  let timer: NodeJS.Timeout | null = null;
  let isImmediateCalled = false;

  const debounced = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    const context = this;

    if (timer) {
      clearTimeout(timer);
    }

    if (immediate && !isImmediateCalled) {
      func.apply(context, args);
      isImmediateCalled = true;
    }

    timer = setTimeout(() => {
      if (!immediate) {
        func.apply(context, args);
      }
      isImmediateCalled = false;
      timer = null;
    }, delay);
  };

  // 取消防抖
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      isImmediateCalled = false;
    }
  };

  // 立即执行剩余的防抖函数
  debounced.flush = function (this: ThisParameterType<T>) {
    if (timer) {
      clearTimeout(timer);
      func.apply(this, []);
      timer = null;
      isImmediateCalled = false;
    }
  };

  return debounced;
};
