import {
  AfterEachCallback,
  BeforeEachCallback,
  BenchmarkCaseDef,
  BenchmarkSuiteOptions,
} from "./types";

export type BenchmarkSuiteDef = {
  beforeEachCallbacks: Array<BeforeEachCallback>;
  afterEachCallbacks: Array<AfterEachCallback>;
  cases: Array<BenchmarkCaseDef>;
  name: string;
  options: BenchmarkSuiteOptions;
};

const WARMUP_RUNS = 100;

export class BenchmarkSuite {
  constructor(private readonly _def: BenchmarkSuiteDef) {}

  public run() {}

  private _runBenchmarkCase(params: {
    benchmarkCase: BenchmarkCaseDef;
    numberOfRuns: number;
  }): Array<number> {
    const {
      numberOfRuns,
      benchmarkCase: { fn, name },
    } = params;

    const runCase = (): number => {
      this._runBeforeEach();
      const tic = performance.now();
      fn();
      const toc = performance.now();
      this._runAfterEach();

      return toc - tic;
    };

    if (this._def.options.warmUp === true) {
      for (let i = 0; i < WARMUP_RUNS; i++) {
        runCase();
      }
    }

    const durationsMs: Array<number> = [];
    for (let i = 0; i < numberOfRuns; i++) {
      const duration = runCase();
      durationsMs.push(duration);
    }

    return durationsMs;
  }

  private _runBeforeEach() {
    for (const beforeEachCb of this._def.beforeEachCallbacks) {
      beforeEachCb();
    }
  }

  private _runAfterEach() {
    for (const afterEachCb of this._def.afterEachCallbacks) {
      afterEachCb();
    }
  }
}
