import { benchmark } from "../../src/benchmark";
import { randomInt } from "../../src/common/utils";
import { SkipList } from "../../src/skip-list";

const SKIP_LIST_SIZE = 10_000;
const SKIP_LIST_OPTIONS = {
  maxLvl: 10,
  p: 1 / 2,
};

benchmark(
  `Skip list, size: ${SKIP_LIST_SIZE}, ${JSON.stringify(SKIP_LIST_OPTIONS)}`,
  {
    numberOfRuns: 1000,
    omitBestAndWorstResult: false,
  },
  (suite) => {
    let skipList: SkipList = null!;
    let randomExistentElement: number = null!;
    let randomNonExistentElement: number = null!;

    suite.beforeEach(() => {
      skipList = new SkipList(SKIP_LIST_OPTIONS);

      for (let i = SKIP_LIST_SIZE - 1; i >= 0; i--) {
        skipList.insert(i);
      }
    });

    // suite.beforeEach(() => {
    //   randomExistentElement = randomInt(SKIP_LIST_SIZE);
    //   randomNonExistentElement = randomInt(SKIP_LIST_SIZE + 1) - 0.5;
    // });

    suite.beforeEach(() => {
      randomExistentElement = 5000;
      randomNonExistentElement = 5000.5;
    });

    suite.case("Insert", () => {
      skipList.insert(randomNonExistentElement);
    });

    suite.case("Delete", () => {
      skipList.delete(randomExistentElement);
    });

    suite.case("Search", () => {
      skipList.has(randomExistentElement);
    });
  }
);
