import { BenchmarkReport } from "./types";
import Table from "cli-table3";

export const reportBenchmarkCli = (params: {
  report: BenchmarkReport;
  suiteName: string;
}): void => {
  const { report, suiteName } = params;

  const table = new Table({
    head: [
      "Name",
      "Number of runs",
      "Min (ms)",
      "Max (ms)",
      "Mean (ms)",
      "Std (ms)",
    ],
  });

  for (const { name, numberOfRuns, min, max, mean, std } of report) {
    table.push({ [name]: [numberOfRuns, min, max, mean, std] });
  }

  console.log("\n\n");
  console.log(
    `----------------------${suiteName.toUpperCase()}----------------------`
  );
  console.log(table.toString());
};
