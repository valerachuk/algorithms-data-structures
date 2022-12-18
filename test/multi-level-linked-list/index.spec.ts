import { assertIsDefined } from "../../src/common/assertions";
import { MultiLevelLinkedList } from "../../src/multi-level-linked-list";
import {
  arrayToFlatLinkedList,
  getNodeAt,
} from "../../src/multi-level-linked-list/utils";

describe("Multi level linked list", () => {
  let testMultiLevelLinkedList1: MultiLevelLinkedList<number> | null = null;

  beforeEach(() => {
    // Multi level linked list #1
    // 1 - 2
    // |   |
    // 3   4 - 5 - 6 - 7 - 8 - 9
    // |       |               |
    // 10- 11  12- 13- 14      15- 16- 17
    //     |                           |
    //     18- 19- 20                  21- 22

    const ll_ = arrayToFlatLinkedList(1, 2);
    assertIsDefined(ll_);

    const ll_0 = arrayToFlatLinkedList(3);
    assertIsDefined(ll_0);
    getNodeAt(ll_, 0).child = ll_0;

    const ll_1 = arrayToFlatLinkedList(4, 5, 6, 7, 8, 9)!;
    getNodeAt(ll_, 1).child = ll_1;

    const ll_00 = arrayToFlatLinkedList(10, 11);
    assertIsDefined(ll_00);
    getNodeAt(ll_0, 0).child = ll_00;

    const ll_11 = arrayToFlatLinkedList(12, 13, 14);
    getNodeAt(ll_1, 1).child = ll_11;

    const ll_15 = arrayToFlatLinkedList(15, 16, 17);
    getNodeAt(ll_1, 5).child = ll_15;

    const ll_001 = arrayToFlatLinkedList(18, 19, 20);
    getNodeAt(ll_00, 1).child = ll_001;

    const ll_152 = arrayToFlatLinkedList(21, 22);
    assertIsDefined(ll_15);
    getNodeAt(ll_15, 2).child = ll_152;

    testMultiLevelLinkedList1 = MultiLevelLinkedList.fromRootNode(ll_);
  });

  test("count", () => {
    // Arrange
    const expectedCount = 22;
    assertIsDefined(testMultiLevelLinkedList1);

    // Act
    const count = testMultiLevelLinkedList1.count();

    // Assert
    expect(count).toBe(expectedCount);
  });

  test.each([
    {
      layer: 0,
      count: 2,
    },
    {
      layer: 1,
      count: 7,
    },
    {
      layer: 2,
      count: 8,
    },
    {
      layer: 3,
      count: 5,
    },
    {
      layer: 4,
      count: 0,
    },
  ])(
    "countOnLayer($layer) should be $count",
    ({ layer, count: expectedCount }) => {
      // Arrange
      assertIsDefined(testMultiLevelLinkedList1);

      // Act
      const count = testMultiLevelLinkedList1.countOnLayer(layer);

      // Assert
      expect(count).toBe(expectedCount);
    }
  );

  test.each([
    {
      path: [1, 5, 2, 1],
      value: 22,
    },
    {
      path: [0],
      value: 1,
    },
    {
      path: [1],
      value: 2,
    },
    {
      path: [0, 0, 0],
      value: 10,
    },
    {
      path: [0, 0, 1, 2],
      value: 20,
    },
  ])("get($path) should be $value", ({ path, value: expectedValue }) => {
    // Arrange
    assertIsDefined(testMultiLevelLinkedList1);

    // Act
    const count = testMultiLevelLinkedList1.get(path);

    // Assert
    expect(count).toBe(expectedValue);
  });
});
