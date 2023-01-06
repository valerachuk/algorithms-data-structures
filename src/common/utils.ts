export const randomInt = (max: number) => Math.floor(Math.random() * max);

export const fisherYatesShuffle = <T>(arr: Array<T>): void => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);

    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
};
