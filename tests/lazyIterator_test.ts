import { expect, fn } from "@std/expect";
import { LazyAsyncIterator } from "../main.ts";

Deno.test("fromIterable should create LazyAsyncIterator", async () => {
  const iter = LazyAsyncIterator.fromIterable([1, 2, 3]);
  expect(await iter.toArray()).toEqual([1, 2, 3]);
});

Deno.test("drop(n) should drop n elements", async () => {
  const iter = LazyAsyncIterator.fromIterable([1, 2, 3, 4, 5]).drop(2);
  const result = await iter.toArray();

  expect(result).toEqual([3, 4, 5]);
});

Deno.test("every(n) should return true if every element passes test", async () => {
  const result = await LazyAsyncIterator.fromIterable([2, 4, 6]).every((val) =>
    val % 2 === 0
  );

  expect(result).toBe(true);
});

Deno.test("every(n) should return false if any element fails test", async () => {
  const result = await LazyAsyncIterator.fromIterable([2, 4, 7]).every((val) =>
    val % 2 === 0
  );

  expect(result).toBe(false);
});

Deno.test("filter() removes elements if they fail a test", async () => {
  const iter = LazyAsyncIterator.fromIterable([2, 4, 7]).filter((val) =>
    val % 2 === 0
  );
  const result = await iter.toArray();

  expect(result).toEqual([2, 4]);
});

Deno.test("find gets the first value that passes a test", async () => {
  const result = await LazyAsyncIterator.fromIterable([2, 4, 7]).find((val) =>
    val % 2 !== 0
  );

  expect(result).toBe(7);
});

Deno.test("find returns undefined if nothing passes", async () => {
  const result = await LazyAsyncIterator.fromIterable([2, 4, 6]).find((val) =>
    val % 2 !== 0
  );

  expect(result).toBe(undefined);
});

Deno.test("flatMap should handle async iterables", async () => {
  async function* asyncGen(val: number) {
    yield val;
    yield val * 10;
  }
  const iter = LazyAsyncIterator.fromIterable([1, 2, 3]).flatMap(asyncGen);
  const result = await iter.toArray();
  expect(result).toEqual([1, 10, 2, 20, 3, 30]);
});

Deno.test("forEach should be called for each element", async () => {
  const iter = LazyAsyncIterator.fromIterable([1, 2, 3]);
  const callback = fn(() => {});
  await iter.forEach(() => callback());

  expect(callback).toHaveBeenCalledTimes(3);
});

Deno.test("map should apply function to each element", async () => {
  const iter = LazyAsyncIterator.fromIterable([1, 2, 3]).map((val) => val * 2);
  const result = await iter.toArray();
  expect(result).toEqual([2, 4, 6]);
});

Deno.test("reduce should accumulate values", async () => {
  const iter = LazyAsyncIterator.fromIterable([1, 2, 3, 4]);
  const result = await iter.reduce((sum, val) => sum + val, 5);
  expect(result).toBe(15);
});

Deno.test("reduce should accumulate values and use the first as a base", async () => {
  const iter = LazyAsyncIterator.fromIterable([1, 2, 3, 4]);
  const result = await iter.reduce((sum, val) => sum + val);
  expect(result).toBe(10);
});

Deno.test("some should return false if no element matches", async () => {
  const iter = LazyAsyncIterator.fromIterable([1, 3, 5]);
  const result = await iter.some((val) => val % 2 === 0);
  expect(result).toBe(false);
});

Deno.test("some should return true if any element matches", async () => {
  const iter = LazyAsyncIterator.fromIterable([1, 3, 6]);
  const result = await iter.some((val) => val % 2 === 0);
  expect(result).toBe(true);
});

Deno.test("take should return only first N elements", async () => {
  const iter = LazyAsyncIterator.fromIterable([1, 2, 3, 4, 5]);
  const result = await iter.take(3).toArray();
  const originalIter = await iter.toArray();

  expect(result).toEqual([1, 2, 3]);
  expect(originalIter).toEqual([4, 5]);
});
