import {
  AfterEachCallback,
  BeforeEachCallback,
  BenchmarkCallback,
  BenchmarkCaseDef,
  BenchmarkSuiteOptions,
} from "./types";

export interface IBenchmarkSuiteBuilder {
  beforeEach(cb: BeforeEachCallback): void;
  afterEach(cb: AfterEachCallback): void;
  case(name: string, fn: BenchmarkCallback): void;
}

export class SuiteBuilder implements IBenchmarkSuiteBuilder {
  private _beforeEachCallbacks: Array<BeforeEachCallback> = [];
  private _afterEachCallbacks: Array<AfterEachCallback> = [];
  private _cases: Array<BenchmarkCaseDef> = [];
  private _name: string | null = null;
  private _options: BenchmarkSuiteOptions | null = null;

  public beforeEach(cb: BenchmarkCallback): void {
    this._beforeEachCallbacks.push(cb);
  }

  public afterEach(cb: BenchmarkCallback): void {
    this._afterEachCallbacks.push(cb);
  }

  public case(name: string, fn: BenchmarkCallback): void {
    this._cases.push({
      name,
      fn,
    });
  }

  public setName(name: string): void {
    this._name = name;
  }

  public setOptions(options: BenchmarkSuiteOptions) {
    this._options = options;
  }

  public;
}
