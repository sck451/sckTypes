import { Result } from "./Result.ts";
import { none, type Option, some } from "../Option/Option.ts";

export function ok<T>(value: T): Result<T, never> {
  return new Ok(value);
}

export class Ok<T, E = never> {
  constructor(private readonly value: T) {}

  isOk() {
    return true;
  }

  isOkAnd(fn: (val: T) => boolean): boolean {
    return fn(this.value);
  }

  isErr() {
    return false;
  }

  isErrAnd(_fn: (err: E) => boolean): boolean {
    return false;
  }

  ok(): Option<T> {
    return some(this.value);
  }

  err(): Option<E> {
    return none();
  }

  map<U>(fn: (val: T) => U): Result<U, E> {
    return ok(fn(this.value));
  }

  mapOr<U>(_defaultValue: U, fn: (val: T) => U): U {
    return fn(this.value);
  }

  mapOrElse<U>(_defaultFn: (err: E) => U, fn: (val: T) => U): U {
    return fn(this.value);
  }

  mapErr<F>(_fn: (err: E) => F): Result<T, F> {
    return ok(this.value);
  }

  inspect(fn: (val: T) => void): Result<T, E> {
    fn(this.value);
    return this;
  }

  inspectErr(_fn: (err: E) => void): Result<T, E> {
    return this;
  }

  iter(): IteratorObject<T, unknown, unknown> {
    return Iterator.from([this.value]);
  }

  unwrap(_message: string = `Expected ok() but got ${this}`): T {
    return this.value;
  }

  unwrapErr(message: string = `Expected error but got ${this}`): E {
    throw new Error(message);
  }

  and<U>(resultB: Result<U, E>): Result<U, E> {
    return resultB;
  }

  andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }

  or<F>(_resultB: Result<T, F>): Result<T, F> {
    return ok(this.value);
  }

  orElse<F>(_fn: (err: E) => Result<T, F>): Result<T, F> {
    return ok(this.value);
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  unwrapOrElse(_fn: (err: E) => T): T {
    return this.value;
  }

  match<R>(matcher: {
    Ok: (val: T) => R;
    Err: (err: E) => R;
  }): R {
    return matcher.Ok(this.value);
  }

  toString(): string {
    return `ok(${this.value})`;
  }
}
