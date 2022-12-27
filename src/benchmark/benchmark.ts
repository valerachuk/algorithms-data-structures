import { AfterEachCallback, BeforeEachCallback } from "./types";

export type BenchmarkSuiteDef = {
  beforeEachCallbacks: Array<BeforeEachCallback>;
  afterEachCallbacks: Array<AfterEachCallback>;
};

export class BenchmarkSuite {}
