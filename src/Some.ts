import { None, none, type Option } from "./Option.ts";
import { ok, type Result } from "./Result.ts";

export function some<T>(value: T): Option<T> {
  return new Some(value);
}

export class Some<T> {
  constructor(private readonly value: T) {}

  isSome(): this is Some<T> {
    return true;
  }

  isSomeAnd(fn: (value: T) => boolean): boolean {
    return fn(this.value);
  }

  isNone(): this is None<T> {
    return false;
  }

  isNoneOr(fn: (value: T) => boolean): boolean {
    return fn(this.value);
  }

  unwrap(_message: string = ""): T {
    return this.value;
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  unwrapOrElse(_fn: () => T): T {
    return this.value;
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return some(fn(this.value));
  }

  inspect(fn: (value: T) => void): Option<T> {
    fn(this.value);

    return this;
  }

  mapOr<U>(_defaultValue: U, fn: (val: T) => U): U {
    return fn(this.value);
  }

  mapOrElse<U>(_defaultFn: () => U, someFn: (val: T) => U): U {
    return someFn(this.value);
  }

  okOr<E>(_err: E): Result<T, E> {
    return ok(this.value);
  }

  iter(): IteratorObject<T, unknown, unknown> {
    return Iterator.from([this.value]);
  }

  and<U>(optionB: Option<U>): Option<U> {
    return optionB;
  }

  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value);
  }

  filter(fn: (value: T) => boolean): Option<T> {
    if (fn(this.value)) {
      return some(this.value);
    } else {
      return none();
    }
  }

  or(_optionB: Option<T>): Option<T> {
    return this;
  }

  orElse(_fn: () => Option<T>): Option<T> {
    return this;
  }

  xor(optionB: Option<T>): Option<T> {
    if (optionB.isNone()) {
      return some(this.value);
    } else {
      return none();
    }
  }

  zip<U>(optionB: Option<U>): Option<[T, U]> {
    if (optionB.isSome()) {
      return some([this.value, optionB.unwrap()]);
    } else {
      return none();
    }
  }

  zipWith<U, R>(optionB: Option<U>, fn: (optA: T, optB: U) => R): Option<R> {
    if (optionB.isSome()) {
      return some(fn(this.value, optionB.unwrap()));
    } else {
      return none();
    }
  }

  match<R>(matcher: {
    Some: (value: T) => R;
    None: () => R;
  }): R {
    return matcher.Some(this.value);
  }

  toString(): string {
    return `some(${this.value})`;
  }
}
