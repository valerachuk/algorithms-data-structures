import { max, mean, min, stdDev } from "../common/math";
import { BenchmarkReportEntry } from "./types";

export const generateBenchmarkReportEntry = (params: {
  caseDurations: ReadonlyArray<number>;
  name: string;
}): BenchmarkReportEntry => {
  const { caseDurations, name } = params;

  const min_ = min(caseDurations);
  const max_ = max(caseDurations);

  const mean_ = mean(caseDurations);
  const std = stdDev(caseDurations);

  return {
    name,
    numberOfRuns: caseDurations.length,
    min: min_,
    max: max_,
    mean: mean_,
    std,
  };
};
