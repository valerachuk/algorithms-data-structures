import { benchmark } from "../../src/benchmark";
import { randomInt } from "../../src/common/utils";
import {
  MultiLevelLinkedList,
  MultiLevelLinkedListPath,
} from "../../src/multi-level-linked-list";
import {
  generateRandomMultiLevelLinkedList,
  generateRandomPath,
} from "./utils";

const MULTI_LEVEL_LL_SIZE = 100_000;
benchmark(
  `Multi level linked list, size: ${MULTI_LEVEL_LL_SIZE}`,
  {
    numberOfRuns: 1000 + 2,
    omitBestAndWorstResult: true,
  },
  (suite) => {
    let multiLevelLinkedList: MultiLevelLinkedList<number> = null!;
    let randomPath: MultiLevelLinkedListPath = null!;
    let randomElement: number = null!;

    suite.beforeEach(() => {
      multiLevelLinkedList =
        generateRandomMultiLevelLinkedList(MULTI_LEVEL_LL_SIZE);
      randomPath = generateRandomPath(MULTI_LEVEL_LL_SIZE);
      randomElement = randomInt(randomElement);
    });

    suite.case("Delete", () => {
      multiLevelLinkedList.dropElement(randomPath);
    });

    suite.case("Insert", () => {
      multiLevelLinkedList.insert(randomElement, randomPath);
    });

    suite.case("Search", () => {
      multiLevelLinkedList.has(randomElement);
    });
  }
);
