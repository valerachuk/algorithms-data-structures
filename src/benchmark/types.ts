export type BeforeAllCallback = () => void;
export type AfterAllCallback = () => void;
export type BeforeEachCallback = () => void;
export type AfterEachCallback = () => void;
export type BenchmarkCallback = () => void;

export type BenchmarkCaseDef = {
  name: string;
  fn: BenchmarkCallback;
};

export type BenchmarkSuiteOptions = {
  numberOfRuns?: number;
  omitBestAndWorstResult?: boolean;
  wamUpRuns?: number;
  warmUp?: boolean;
};

export type BenchmarkReport = Array<BenchmarkReportEntry>;
export type BenchmarkReportEntry = {
  name: string;
  numberOfRuns: number;
  min: number;
  max: number;
  mean: number;
  std: number;
};
