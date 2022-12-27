import { BenchmarkSuiteBuilder, IBenchmarkSuiteBuilder } from "./sute-builder";
import { BenchmarkSuiteOptions } from "./types";

export const benchmark = (
  name: string,
  options: BenchmarkSuiteOptions,
  cb: (suite: IBenchmarkSuiteBuilder) => void
): void => {
  const suiteBuilder = new BenchmarkSuiteBuilder();

  cb(suiteBuilder);

  const benchmarkSuite = suiteBuilder.setName(name).setOptions(options).build();

  benchmarkSuite.run();
};
