export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T {
  let lastFunc: ReturnType<typeof setTimeout> | null;
  let lastRan: number | null = null;

  return function (this: any, ...args: any[]) {
    const context = this;
    const now = Date.now();

    if (lastRan === null || now - lastRan >= limit) {
      func.apply(context, args);
      lastRan = now;
    } else {
      if (lastFunc) clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        func.apply(context, args);
        lastRan = Date.now();
      }, limit - (now - lastRan));
    }
  } as T;
}
