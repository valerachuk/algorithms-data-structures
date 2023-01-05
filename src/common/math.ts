export const mean = (arr: ReadonlyArray<number>) =>
  arr.reduce((a, b) => a + b, 0) / arr.length;

export const stdDev = (arr: ReadonlyArray<number>) => {
  const mean_ = mean(arr);

  const variance =
    arr.reduce((acc, x) => acc + (x - mean_) ** 2, 0) / (arr.length - 1);

  return Math.sqrt(variance);
};

export const min = (arr: ReadonlyArray<number>) => {
  let min = arr[0];

  for (const x of arr) {
    if (x < min) {
      min = x;
    }
  }

  return min;
};

export const max = (arr: ReadonlyArray<number>) => {
  let max = arr[0];

  for (const x of arr) {
    if (x > max) {
      max = x;
    }
  }

  return max;
};
