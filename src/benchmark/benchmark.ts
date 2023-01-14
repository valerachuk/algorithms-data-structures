import { max, min } from "../common/math";
import { generateBenchmarkReportEntry } from "./report-generator";
import { reportBenchmarkCli } from "./reporter";
import {
  AfterAllCallback,
  AfterEachCallback,
  BeforeAllCallback,
  BeforeEachCallback,
  BenchmarkCallback,
  BenchmarkCaseDef,
  BenchmarkReport,
  BenchmarkSuiteOptions,
} from "./types";

export type BenchmarkSuiteDef = {
  beforeAllCallbacks: Array<BeforeAllCallback>;
  afterAllCallbacks: Array<AfterAllCallback>;
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
  omitBestAndWorstResult: false,
} satisfies Required<BenchmarkSuiteOptions>;

export class BenchmarkSuite {
  private readonly _beforeAllCallbacks: Array<BeforeAllCallback>;
  private readonly _afterAllCallbacks: Array<AfterAllCallback>;
  private readonly _beforeEachCallbacks: Array<BeforeEachCallback>;
  private readonly _afterEachCallbacks: Array<AfterEachCallback>;
  private readonly _cases: Array<BenchmarkCaseDef>;
  private readonly _name: string;
  private readonly _options: Required<BenchmarkSuiteOptions>;

  constructor(def: BenchmarkSuiteDef) {
    this._beforeAllCallbacks = def.beforeAllCallbacks;
    this._afterAllCallbacks = def.afterAllCallbacks;
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

    for (const { name, fn } of this._cases) {
      console.log(`Running benchmark case: ${name}`);
      const tic = performance.now();
      let caseDurations = this._runBenchmarkCase(fn);
      const toc = performance.now();

      console.log(
        `Running benchmark case: ${name} - done in ${(toc - tic) / 1e3} (s)`
      );

      if (this._options.omitBestAndWorstResult === true) {
        caseDurations = this._dropBestAndWorstCase(caseDurations);
      }

      const reportEntry = generateBenchmarkReportEntry({
        caseDurations,
        name,
      });

      report.push(reportEntry);
    }

    reportBenchmarkCli({
      report,
      suiteName: this._name,
    });
  }

  private _dropBestAndWorstCase(
    durations: ReadonlyArray<number>
  ): Array<number> {
    const min_ = min(durations);
    const max_ = max(durations);

    return durations.filter((x) => x !== min_ && x !== max_);
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

    this._runBeforeAll();

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

    this._runAfterAll();

    return durationsMs;
  }

  private _runBeforeAll() {
    for (const beforeAllCb of this._beforeAllCallbacks) {
      beforeAllCb();
    }
  }

  private _runAfterAll() {
    for (const afterAllCb of this._afterAllCallbacks) {
      afterAllCb();
    }
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
