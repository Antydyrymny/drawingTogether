export function throttle<T>(fn: (...args: T[]) => void, delay: number) {
    let throttling = false;
    let savedArgs: T[] | null = null;
    let savedThis: unknown = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function wrapper(this: any, ...args: T[]) {
        if (throttling) {
            savedArgs = args;
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            savedThis = this;
        } else {
            throttling = true;
            fn.apply(this, args);
            setTimeout(() => {
                throttling = false;
                if (savedArgs) {
                    wrapper.apply(savedThis, savedArgs);
                    savedArgs = null;
                    savedThis = null;
                }
            }, delay);
        }
    };
}
