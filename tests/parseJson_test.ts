import { expect } from "@std/expect";

import {
  err,
  isRecord,
  JsonParseError,
  ok,
  parseJsonInto,
  type Result,
} from "../main.ts";

// A sample deserializable type for testing
class Person {
  constructor(public name: string, public age: number) {}

  static fromJson(data: unknown): Result<Person, JsonParseError> {
    if (!isRecord(data)) {
      return err(new JsonParseError("Not an object"));
    }

    const { name, age } = data;

    if (typeof name !== "string") {
      return err(new JsonParseError("Invalid name"));
    }

    if (typeof age !== "number") {
      return err(new JsonParseError("Invalid age"));
    }

    return ok(new Person(name, age));
  }
}

Deno.test("parseJsonInto - successful parse", () => {
  const json = `{"name": "Alice", "age": 30}`;
  const result = parseJsonInto(Person, json);
  if (result.isErr()) {
    throw new Error("Expected success but got error");
  }

  expect(result.unwrap()).toMatchObject({ name: "Alice", age: 30 });
  expect(result.unwrap()).toBeInstanceOf(Person);
});

Deno.test("parseJsonInto - malformed JSON", () => {
  const json = `{"name": "Bob", "age": 40`; // missing closing brace
  const result = parseJsonInto(Person, json);

  expect(result.isErr()).toEqual(true);
  expect(result.unwrapErr()).toBeInstanceOf(JsonParseError);
});

Deno.test("parseJsonInto - validation error from fromJson", () => {
  const json = `{"name": 42, "age": "not a number"}`;
  const result = parseJsonInto(Person, json);

  expect(result.isErr()).toBe(true);
  const errObj = result.unwrapErr();
  expect(errObj).toBeInstanceOf(JsonParseError);
  expect(errObj.message).toBe("Invalid name"); // name fails first
});

Deno.test("isRecord - valid object", () => {
  expect(isRecord({ hello: "world" })).toBe(true);
});

Deno.test("isRecord - null", () => {
  expect(isRecord(null)).toBe(false);
});

Deno.test("isRecord - array", () => {
  expect(isRecord([])).toBe(true); // Arrays are typeof 'object', not null
});

Deno.test("isRecord - string", () => {
  expect(isRecord("hi")).toBe(false);
});
