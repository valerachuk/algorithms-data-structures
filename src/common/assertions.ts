export function assertIsDefined<TValue>(
  value: TValue
): asserts value is NonNullable<TValue> {
  if (value === null || value === undefined) {
    throw new Error("value is not defined.");
  }
}
