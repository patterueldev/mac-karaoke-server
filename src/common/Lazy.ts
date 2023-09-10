export function lazyValue<T>(compute: () => T): Lazy<T> {
  let value: T | undefined;
  return () => {
    if (!value) {
      value = compute();
    }
    return value;
  };
}

export function lazyValueAsync<T>(compute: () => Promise<T>): Lazy<Promise<T>> {
  let value: T | undefined;
  return async function() { // changed to use a regular function
    if (!value) {
      value = await compute();
    }
    return value;
  };
}

export type Lazy<T> = () => T;