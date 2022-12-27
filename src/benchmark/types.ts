export type BeforeEachCallback = () => void;
export type AfterEachCallback = () => void;
export type BenchmarkCallback = () => void;

export type BenchmarkCaseDef = {
  name: string;
  fn: BenchmarkCallback;
};

export type BenchmarkSuiteOptions = {
  numberOfRuns: Array<number>;
};
