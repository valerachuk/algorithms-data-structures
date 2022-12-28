import { mean, stdDev } from "../common/math";
import { BenchmarkReportEntry } from "./types";

export const generateBenchmarkReportEntry = (params: {
  caseDurations: ReadonlyArray<number>;
  name: string;
}): BenchmarkReportEntry => {
  const { caseDurations, name } = params;

  const min = Math.min(...caseDurations);
  const max = Math.max(...caseDurations);

  const mean_ = mean(caseDurations);
  const std = stdDev(caseDurations);

  return {
    name,
    numberOfRuns: caseDurations.length,
    min,
    max,
    mean: mean_,
    std,
  };
};
