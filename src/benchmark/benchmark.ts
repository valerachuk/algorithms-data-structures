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

export class BenchmarkSuite {
  constructor(private readonly _def: BenchmarkSuiteDef) {}

  public run() {}

  private _runBenchmarkCase(benchmarkCase: BenchmarkCaseDef) {
    this._runBeforeEach();

    this._runAfterEach();
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
