export default function isAsyncIterable(
  val: unknown,
): val is AsyncIterable<unknown> {
  return Symbol.asyncIterator in Object(val);
}
