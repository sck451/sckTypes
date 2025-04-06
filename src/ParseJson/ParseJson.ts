import { err, type Result } from "../../main.ts";

export class JsonParseError extends Error {}

export type JsonDeserializable<T> = {
  fromJson: (data: unknown) => Result<T, JsonParseError>;
};

export function parseJsonInto<T>(
  into: JsonDeserializable<T>,
  json: string,
): Result<T, JsonParseError> {
  let data;
  try {
    data = JSON.parse(json) as unknown;
  } catch (e) {
    return err(new JsonParseError(String(e)));
  }

  return into.fromJson(data);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
