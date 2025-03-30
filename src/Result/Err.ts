import { Result } from "./Result.ts";
import { none, type Option, some } from "../Option/Option.ts";

export function err<E>(error: E): Result<never, E> {
  return new Err(error);
}

export class Err<T = never, E = unknown> {
  constructor(private readonly error: E) {}

  isOk() {
    return false;
  }

  isOkAnd(_fn: (val: T) => boolean): boolean {
    return false;
  }

  isErr() {
    return true;
  }

  isErrAnd(fn: (err: E) => boolean): boolean {
    return fn(this.error);
  }

  ok(): Option<T> {
    return none();
  }

  err(): Option<E> {
    return some(this.error);
  }

  map<U>(_fn: (val: T) => U): Result<U, E> {
    return err(this.error);
  }

  mapOr<U>(defaultValue: U, _fn: (val: T) => U): U {
    return defaultValue;
  }

  mapOrElse<U>(defaultFn: (err: E) => U, _fn: (val: T) => U): U {
    return defaultFn(this.error);
  }

  mapErr<F>(fn: (err: E) => F): Result<T, F> {
    return err(fn(this.error));
  }

  inspect(_fn: (val: T) => void): Result<T, E> {
    return this;
  }

  inspectErr(fn: (err: E) => void): Result<T, E> {
    fn(this.error);
    return this;
  }

  iter(): Iterator<T> {
    return Iterator.from([]);
  }

  unwrap(message: string = `Expected ok() but got ${this}`): T {
    throw new Error(message);
  }

  unwrapErr(_message: string = `Expected error but got ${this}`): E {
    return this.error;
  }

  and<U>(_resultB: Result<U, E>): Result<U, E> {
    return err(this.error);
  }

  andThen<U>(_fn: (val: T) => Result<U, E>): Result<U, E> {
    return err(this.error);
  }

  or<F>(resultB: Result<T, F>): Result<T, F> {
    return resultB;
  }

  orElse<F>(fn: (err: E) => Result<T, F>): Result<T, F> {
    return fn(this.error);
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse(fn: (err: E) => T): T {
    return fn(this.error);
  }

  match<R>(matcher: {
    Ok: (val: T) => R;
    Err: (err: E) => R;
  }): R {
    return matcher.Err(this.error);
  }

  toString(): string {
    return `err(${this.error})`;
  }
}
