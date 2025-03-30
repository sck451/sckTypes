import { Option, Some, some } from "./Option.ts";
import { err, type Result } from "../Result/Result.ts";

export function none<T>(): Option<T> {
  return new None();
}

export class None<T> {
  isSome(): this is Some<T> {
    return false;
  }

  isSomeAnd(_fn: (value: T) => boolean): boolean {
    return false;
  }

  isNone(): this is None<T> {
    return true;
  }

  isNoneOr(_fn: (value: T) => boolean): boolean {
    return true;
  }

  unwrap(message: string = "Called Option#unwrap on a None value"): T {
    throw new Error(message);
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse(fn: () => T): T {
    return fn();
  }

  map<U>(_fn: (value: T) => U): Option<U> {
    return none();
  }

  inspect(_fn: (value: T) => void): Option<T> {
    return this;
  }

  mapOr<U>(defaultValue: U, _fn: (val: T) => U): U {
    return defaultValue;
  }

  mapOrElse<U>(defaultFn: () => U, _someFn: (val: T) => U): U {
    return defaultFn();
  }

  okOr<E>(error: E): Result<T, E> {
    return err(error);
  }

  iter(): Iterable<T> {
    return Iterator.from([]);
  }

  and<U>(_optionB: Option<U>): Option<U> {
    return none();
  }

  andThen<U>(_fn: (value: T) => Option<U>): Option<U> {
    return none();
  }

  filter(_fn: (value: T) => boolean): Option<T> {
    return none();
  }

  or(optionB: Option<T>): Option<T> {
    return optionB;
  }

  orElse(fn: () => Option<T>): Option<T> {
    return fn();
  }

  xor(optionB: Option<T>): Option<T> {
    if (optionB.isSome()) {
      return some(optionB.unwrap());
    } else {
      return none();
    }
  }

  zip<U>(_optionB: Option<U>): Option<[T, U]> {
    return none();
  }

  zipWith<U, R>(_optionB: Option<U>, _fn: (optA: T, optB: U) => R): Option<R> {
    return none();
  }

  match<R>(matcher: {
    Some: (value: T) => R;
    None: () => R;
  }): R {
    return matcher.None();
  }

  toString(): string {
    return "none";
  }
}
