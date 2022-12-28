export const mean = (arr: ReadonlyArray<number>) =>
  arr.reduce((a, b) => a + b, 0) / arr.length;

export const stdDev = (arr: ReadonlyArray<number>) => {
  const mean_ = mean(arr);

  const variance =
    arr.reduce((acc, x) => acc + (x - mean_) ** 2, 0) / (arr.length - 1);

  return Math.sqrt(variance);
};
