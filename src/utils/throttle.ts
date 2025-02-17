export const throttle = (fn: Function, delay = 1000) => {
  let last = 0;
  return function (this: any, ...args: any[]) {
    const now = performance.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
};
