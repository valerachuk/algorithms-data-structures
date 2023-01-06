import { assertIsDefined } from "../common/assertions";
import { BenchmarkSuite } from "./benchmark";
import {
  AfterEachCallback,
  BeforeEachCallback,
  BenchmarkCallback,
  BenchmarkCaseDef,
  BenchmarkSuiteOptions,
} from "./types";

export interface IBenchmarkSuiteBuilder {
  beforeEach(cb: BeforeEachCallback): IBenchmarkSuiteBuilder;
  afterEach(cb: AfterEachCallback): IBenchmarkSuiteBuilder;
  case(name: string, fn: BenchmarkCallback): IBenchmarkSuiteBuilder;
}

export class BenchmarkSuiteBuilder implements IBenchmarkSuiteBuilder {
  private _beforeEachCallbacks: Array<BeforeEachCallback> = [];
  private _afterEachCallbacks: Array<AfterEachCallback> = [];
  private _cases: Array<BenchmarkCaseDef> = [];
  private _name: string | null = null;
  private _options: BenchmarkSuiteOptions | null = null;

  public beforeEach(cb: BenchmarkCallback): BenchmarkSuiteBuilder {
    this._beforeEachCallbacks.push(cb);
    return this;
  }

  public afterEach(cb: BenchmarkCallback): BenchmarkSuiteBuilder {
    this._afterEachCallbacks.push(cb);
    return this;
  }

  public case(name: string, fn: BenchmarkCallback): BenchmarkSuiteBuilder {
    this._cases.push({
      name,
      fn,
    });
    return this;
  }

  public setName(name: string): BenchmarkSuiteBuilder {
    this._name = name;
    return this;
  }

  public setOptions(options: BenchmarkSuiteOptions): BenchmarkSuiteBuilder {
    this._options = options;
    return this;
  }

  public build(): BenchmarkSuite {
    assertIsDefined(this._name, "Test suite name must be defined.");
    assertIsDefined(this._options, "Test suite options must be defined.");

    if (this._cases.length === 0) {
      throw new Error("Benchmark suite must have at least one benchmark case.");
    }

    return new BenchmarkSuite({
      beforeEachCallbacks: this._beforeEachCallbacks,
      afterEachCallbacks: this._afterEachCallbacks,
      cases: this._cases,
      name: this._name,
      options: this._options,
    });
  }
}
