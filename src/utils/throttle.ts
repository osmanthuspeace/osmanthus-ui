export const throttle = (fn: Function, delay = 100) => {
  let last = 0;
  return function (this: any, ...args: any[]) {
    const now = performance.now();
    // console.log("now", now, "last", last, "now - last", now - last);
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
};
