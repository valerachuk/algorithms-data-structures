import { generateBenchmarkReportEntry } from "./report-generator";
import {
  AfterEachCallback,
  BeforeEachCallback,
  BenchmarkCallback,
  BenchmarkCaseDef,
  BenchmarkReport,
  BenchmarkSuiteOptions,
} from "./types";

export type BenchmarkSuiteDef = {
  beforeEachCallbacks: Array<BeforeEachCallback>;
  afterEachCallbacks: Array<AfterEachCallback>;
  cases: Array<BenchmarkCaseDef>;
  name: string;
  options: BenchmarkSuiteOptions;
};

const benchmarkOptionsDefault = {
  numberOfRuns: 1000,
  warmUp: true,
  wamUpRuns: 50,
  omitBestAndWorstResult: true,
} satisfies Required<BenchmarkSuiteOptions>;

export class BenchmarkSuite {
  private readonly _beforeEachCallbacks: Array<BeforeEachCallback>;
  private readonly _afterEachCallbacks: Array<AfterEachCallback>;
  private readonly _cases: Array<BenchmarkCaseDef>;
  private readonly _name: string;
  private readonly _options: Required<BenchmarkSuiteOptions>;

  constructor(def: BenchmarkSuiteDef) {
    this._beforeEachCallbacks = def.beforeEachCallbacks;
    this._afterEachCallbacks = def.afterEachCallbacks;
    this._cases = def.cases;
    this._name = def.name;
    this._options = {
      ...benchmarkOptionsDefault,
      ...def.options,
    };
  }

  public run() {
    const report: BenchmarkReport = [];

    for (const benchmarkCase of this._cases) {
      const caseDurations = this._runBenchmarkCase(benchmarkCase.fn);
      const reportEntry = generateBenchmarkReportEntry({
        caseDurations,
        name: benchmarkCase.name,
      });

      report.push(reportEntry);
    }
  }

  private _dropBestAndWorstCase(
    durations: ReadonlyArray<number>
  ): Array<number> {
    const min = Math.min(...durations);
    const max = Math.max(...durations);

    return durations.filter((x) => x !== min && x !== max);
  }

  private _runBenchmarkCase(fn: BenchmarkCallback): Array<number> {
    const runCase = (): number => {
      this._runBeforeEach();
      const tic = performance.now();
      fn();
      const toc = performance.now();
      this._runAfterEach();

      return toc - tic;
    };

    if (this._options.warmUp === true) {
      for (let i = 0; i < this._options.wamUpRuns; i++) {
        runCase();
      }
    }

    const durationsMs: Array<number> = [];
    for (let i = 0; i < this._options.numberOfRuns; i++) {
      const duration = runCase();
      durationsMs.push(duration);
    }

    return durationsMs;
  }

  private _runBeforeEach() {
    for (const beforeEachCb of this._beforeEachCallbacks) {
      beforeEachCb();
    }
  }

  private _runAfterEach() {
    for (const afterEachCb of this._afterEachCallbacks) {
      afterEachCb();
    }
  }
}
