export default function iterableToAsync<T>(
  iterable: Iterable<T>,
): AsyncIterable<T> {
  return async function* () {
    for await (const value of iterable) {
      yield value;
    }
  }();
}
