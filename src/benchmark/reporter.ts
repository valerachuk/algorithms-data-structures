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
      "Min (ns)",
      "Max (ns)",
      "Mean (ns)",
      "Std (ns)",
    ],
  });

  for (const { name, numberOfRuns, min, max, mean, std } of report) {
    table.push({
      [name]: [
        numberOfRuns,
        (min * 1000).toFixed(3),
        (max * 1000).toFixed(3),
        (mean * 1000).toFixed(3),
        (std * 1000).toFixed(3),
      ],
    });
  }

  console.log("\n\n");
  console.log(
    `----------------------${suiteName.toUpperCase()}----------------------`
  );
  console.log(table.toString());
};
