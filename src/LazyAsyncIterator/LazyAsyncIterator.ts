import { none, type Option, some } from "../../main.ts";
import isAsyncIterable from "./helpers/isAsyncIterable.ts";
import iterableToAsync from "./helpers/iteratorToAsync.ts";

export default class LazyAsyncIterator<T> {
  constructor(private readonly current: AsyncIterable<T>) {}

  async *[Symbol.asyncIterator](): AsyncIterableIterator<T> {
    yield* this.current;
  }

  static fromIterable<T>(iterable: Iterable<T>): LazyAsyncIterator<T> {
    return new LazyAsyncIterator(iterableToAsync(iterable));
  }

  drop(count: number): LazyAsyncIterator<T> {
    if (count < 0) {
      throw new RangeError("Iterator limits cannot be negative");
    }

    const previous = this.current;

    return new LazyAsyncIterator(
      (async function* drop(): AsyncIterableIterator<T> {
        let i = 0;
        for await (const value of previous) {
          if (i++ >= count) {
            yield value;
          }
        }
      })(),
    );
  }

  async every(
    fn: (value: T) => Promise<boolean> | boolean,
  ): Promise<boolean> {
    for await (const value of this) {
      if (!(await fn(value))) {
        return false;
      }
    }
    return true;
  }

  filter(
    fn: (value: T) => Promise<boolean> | boolean,
  ): LazyAsyncIterator<T> {
    const previous = this.current;

    return new LazyAsyncIterator(
      (async function* filter(): AsyncIterableIterator<T> {
        for await (const value of previous) {
          if (await fn(value)) {
            yield value;
          }
        }
      })(),
    );
  }

  async find(
    fn: (value: T) => Promise<boolean> | boolean,
  ): Promise<Option<T>> {
    for await (const value of this) {
      if (await fn(value)) {
        return some(value);
      }
    }
    return none();
  }

  flatMap<U>(
    fn: (value: T) => AsyncIterable<U>,
  ): LazyAsyncIterator<U> {
    const previous = this.current;

    return new LazyAsyncIterator(
      (async function* flatMap(): AsyncIterableIterator<U> {
        for await (const value of previous) {
          const result = fn(value);
          if (isAsyncIterable(result)) {
            yield* result;
          } else {
            throw new TypeError(`Expected AsyncIterable, got ${result}`);
          }
        }
      })(),
    );
  }

  async forEach(
    fn: (value: T, index: number) => Promise<void> | void,
  ): Promise<void> {
    let i = 0;
    for await (const value of this) {
      await fn(value, i++);
    }
  }

  map<U>(fn: (value: T) => Promise<U> | U): LazyAsyncIterator<U> {
    const previous = this.current;

    return new LazyAsyncIterator(
      (async function* map(): AsyncIterableIterator<U> {
        for await (const value of previous) {
          yield await fn(value);
        }
      })(),
    );
  }

  reduce<U>(
    fn: (
      accumulator: U,
      currentValue: T,
      currentIndex: number,
    ) => Promise<U> | U,
    initialValue: U,
  ): Promise<U>;
  reduce(
    fn: (
      accumulator: T,
      currentValue: T,
      currentIndex: number,
    ) => Promise<T> | T,
  ): Promise<T>;

  async reduce<U>(
    fn: (
      accumulator: U | T,
      currentValue: T,
      currentIndex: number,
    ) => Promise<U | T> | U | T,
    initialValue?: U | T,
  ): Promise<U | T> {
    const iterator = this[Symbol.asyncIterator]();
    let i = 0;
    let accumulator: U | T;

    if (arguments.length === 2) {
      accumulator = initialValue!;
    } else {
      const first = await iterator.next();
      if (first.done) {
        throw new TypeError(
          "Reduce of empty iterator with no initial value",
        );
      }
      accumulator = first.value as U | T;
      i = 1;
    }

    for await (const value of iterator) {
      accumulator = await fn(accumulator, value, i++);
    }

    return accumulator;
  }

  async some(fn: (value: T) => Promise<boolean> | boolean): Promise<boolean> {
    for await (const value of this) {
      if (await fn(value)) {
        return true;
      }
    }
    return false;
  }

  take(count: number): LazyAsyncIterator<T> {
    if (count < 0) {
      throw new RangeError("Cannot take less than 0 elements");
    }
    const parent = this[Symbol.asyncIterator]();

    return new LazyAsyncIterator(
      (async function* take(): AsyncIterableIterator<T> {
        for (let i = 0; i < count; i++) {
          const { value, done } = await parent.next();

          if (done) {
            return;
          }

          yield value;
        }
      })(),
    );
  }

  toArray(): Promise<T[]> {
    return this.reduce((acc, val) => {
      acc.push(val);
      return acc;
    }, [] as T[]);
  }
}
