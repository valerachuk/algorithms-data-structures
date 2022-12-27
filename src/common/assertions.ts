export function assertIsDefined<TValue>(
  value: TValue,
  message: string = "value is not defined."
): asserts value is NonNullable<TValue> {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}
