import { benchmark } from "../../src/benchmark";
import { mean } from "../../src/common/math";
import { SkipList, SkipListDef } from "../../src/skip-list";

const NUMBER_OF_RUNS = 1000;
const SKIP_LIST_SIZE = 10_000;
const SKIP_LIST_OPTIONS = {
  maxLvl: 9,
  p: 1 / Math.E,
} satisfies SkipListDef;

benchmark(
  `Average number of pointers, number of runs: ${NUMBER_OF_RUNS}, size: ${SKIP_LIST_SIZE}, ${JSON.stringify(
    SKIP_LIST_OPTIONS
  )}`,
  {
    numberOfRuns: NUMBER_OF_RUNS,
    omitBestAndWorstResult: false,
    warmUp: false,
  },
  (suite) => {
    let averagePointersPerNodePerRun: Array<number> = null!;

    suite.beforeAll(() => {
      averagePointersPerNodePerRun = [];
    });

    suite.afterAll(() => {
      const mean_ = mean(averagePointersPerNodePerRun);
      console.log({
        averagePointersPerNode: mean_,
      });
    });

    suite.case("measure", () => {
      const skipList = new SkipList(SKIP_LIST_OPTIONS);

      for (let i = SKIP_LIST_SIZE - 1; i >= 0; i--) {
        skipList.insert(i);
      }

      const totalPointers = skipList.totalPointers();
      const size = skipList.size();
      const averagePointersPerNode = totalPointers / size;

      averagePointersPerNodePerRun.push(averagePointersPerNode);
    });
  }
);
