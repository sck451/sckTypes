import { expect } from "@std/expect";
import { getWeakMapHasher, HashMap, none, some } from "../main.ts";
import { getHybridHasher } from "../src/HashMap/HashMap.ts";

Deno.test("HashMap basic set/get/has", () => {
  const map = new HashMap<string, number>();

  expect(map.isEmpty()).toBe(true);
  map.set("foo", 1);
  map.set("bar", 2);

  expect(map.size()).toBe(2);
  expect(map.get("foo")).toEqual(some(1));
  expect(map.get("bar")).toEqual(some(2));
  expect(map.has("foo")).toBe(true);
  expect(map.has("baz")).toBe(false);
});

Deno.test("HashMap getKeyValue returns key and value", () => {
  const map = new HashMap<string, number>();
  map.set("x", 42);
  expect(map.getKeyValue("x")).toEqual(some(["x", 42]));
});

Deno.test("HashMap remove returns value and deletes entry", () => {
  const map = new HashMap<string, string>();
  map.set("a", "alpha");
  expect(map.remove("a")).toEqual(some("alpha"));
  expect(map.get("a")).toEqual(none());
});

Deno.test("HashMap clear empties all entries", () => {
  const map = new HashMap<string, number>();
  map.set("a", 1);
  map.set("b", 2);
  map.clear();

  expect(map.size()).toBe(0);
  expect([...map]).toEqual([]);
});

Deno.test("HashMap entries() produces Entry wrappers", () => {
  const map = new HashMap<string, string>();
  map.set("a", "A");
  map.set("b", "B");
  const entries = Array.from(map.entries());

  expect(entries.length).toBe(2);
});

Deno.test("HashMap resize maintains data integrity", () => {
  const map = new HashMap<number, string>();
  for (let i = 0; i < 100; i++) {
    map.set(i, `val${i}`);
  }
  for (let i = 0; i < 100; i++) {
    expect(map.get(i)).toEqual(some(`val${i}`));
  }
});

Deno.test("HashMap with WeakMap hasher handles object keys", () => {
  const hasher = getWeakMapHasher();
  const map = new HashMap<object, string>(hasher);
  const key1 = {};
  const key2 = {};
  map.set(key1, "a");
  map.set(key2, "b");

  expect(map.get(key1)).toEqual(some("a"));
  expect(map.get(key2)).toEqual(some("b"));
});

Deno.test("HashMap with mixed extensible keys handles object keys", () => {
  const hasher = getHybridHasher();
  const map = new HashMap<object, string>(hasher);
  const key1 = {};
  const key2 = Object.freeze({});
  map.set(key1, "a");
  map.set(key2, "b");

  expect(Object.getOwnPropertySymbols(key1).length).toBe(1);
  expect(Object.getOwnPropertySymbols(key2).length).toBe(0);

  expect(map.get(key1)).toEqual(some("a"));
  expect(map.get(key2)).toEqual(some("b"));
});

Deno.test("HashMap map() transforms values", () => {
  const map = new HashMap<string, number>();
  map.set("x", 1);
  map.set("y", 2);
  map.map((val) => val * 2);

  expect(map.get("x")).toEqual(some(2));
  expect(map.get("y")).toEqual(some(4));
});

Deno.test("HashMap retain() filters entries", () => {
  const map = new HashMap<string, number>();
  map.set("a", 1);
  map.set("b", 2);
  map.set("c", 3);
  map.retain((_, v) => v % 2 === 1);

  expect(map.size()).toBe(2);
  expect(map.get("a")).toEqual(some(1));
  expect(map.get("c")).toEqual(some(3));
  expect(map.get("b")).toEqual(none());
});

Deno.test("HashMap drain yields and clears", () => {
  const map = new HashMap<string, number>();
  map.set("x", 10);
  map.set("y", 20);
  const entries = Array.from(map.drain());

  expect(entries.length).toBe(2);
  expect(map.size()).toBe(0);
});

Deno.test("HashMap.from() builds map from pairs", () => {
  const pairs: [string, number][] = [["a", 1], ["b", 2], ["c", 3]];
  const map = HashMap.from(pairs);

  expect(map.size()).toBe(3);
  expect(map.get("b")).toEqual(some(2));
});

Deno.test("HashMap: entry().orInsert inserts if missing", () => {
  const map = new HashMap<string, number>();
  const entry = map.entry("x");
  entry.orInsert(42);

  expect(map.get("x")).toEqual(some(42));
});

Deno.test("HashMap: entry().orInsertWith inserts lazily", () => {
  const map = new HashMap<string, number>();
  let called = false;
  const entry = map.entry("x");
  entry.orInsertWith(() => {
    called = true;
    return 99;
  });

  expect(called).toBe(true);
  expect(map.get("x")).toEqual(some(99));
});

Deno.test("HashMap: entry().andModify modifies if present", () => {
  const map = new HashMap<string, number>();
  map.set("x", 10);
  map.entry("x").andModify((v) => v += 5);
  map.entry("y").andModify((v) => v += 5);

  expect(map.get("x")).toEqual(some(15));
  expect(map.get("y")).toEqual(none());
});

Deno.test("HashMap: Entry.remove() removes entry", () => {
  const map = new HashMap<string, string>();
  map.set("hello", "world");
  const entry = map.entry("hello");
  expect(entry.remove()).toEqual(some("world"));
  expect(map.has("hello")).toBe(false);
  expect(map.entry("bonjour").remove()).toEqual(none());
});
