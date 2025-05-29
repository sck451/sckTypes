import { Option, Some, some } from "./Option.ts";
import { Err, err } from "../Result/Result.ts";

export function none<T = never>(): None<T> {
  return new None();
}

export class None<T = never> {
  isSome(): this is Some<T> {
    return false;
  }

  isSomeAnd(_fn: (value: T) => boolean): false {
    return false;
  }

  isNone(): this is None<T> {
    return true;
  }

  isNoneOr(_fn: (value: T) => boolean): true {
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

  map<U>(_fn: (value: T) => U): None<U> {
    return none();
  }

  inspect(_fn: (value: T) => void): None<T> {
    return this;
  }

  mapOr<U>(defaultValue: U, _fn: (val: T) => U): U {
    return defaultValue;
  }

  mapOrElse<U>(defaultFn: () => U, _someFn: (val: T) => U): U {
    return defaultFn();
  }

  okOr<E>(error: E): Err<T, E> {
    return err(error);
  }

  iter(): Iterable<T> {
    return Iterator.from([]);
  }

  and<U>(_optionB: Option<U>): None<never> {
    return none();
  }

  andThen<U>(_fn: (value: T) => Option<U>): None<never> {
    return none();
  }

  filter(_fn: (value: T) => boolean): None<never> {
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

  zip<U>(_optionB: Option<U>): None<never> {
    return none();
  }

  zipWith<U, R>(
    _optionB: Option<U>,
    _fn: (optA: T, optB: U) => R,
  ): None<never> {
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
