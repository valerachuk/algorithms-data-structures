import { assertIsDefined } from "../../src/common/assertions";
import { MultiLevelLinkedList } from "../../src/multi-level-linked-list";
import {
  arrayToFlatLinkedList,
  getNodeAt,
} from "../../src/multi-level-linked-list/utils";

const getTestMultiLevelLinkedList1Flat = () =>
  [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22,
  ].concat();

describe("Multi level linked list", () => {
  let testMultiLevelLinkedList1: MultiLevelLinkedList<number> = null!;

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
  ])("countOnLayer($layer) === $count", ({ layer, count: expectedCount }) => {
    // Arrange

    // Act
    const count = testMultiLevelLinkedList1.countOnLayer(layer);

    // Assert
    expect(count).toBe(expectedCount);
  });

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
  ])("getValue($path) === $value", ({ path, value: expectedValue }) => {
    // Arrange

    // Act
    const count = testMultiLevelLinkedList1.getValue(path);

    // Assert
    expect(count).toBe(expectedValue);
  });

  test("toFlatArray", () => {
    // Arrange

    // Act
    const flatArray = testMultiLevelLinkedList1.toFlatArray();

    // Assert
    expect(flatArray).toEqual(getTestMultiLevelLinkedList1Flat());
  });

  test.each([
    {
      path: [0],
      value: 42,
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.unshift(42);
        return arr;
      })(),
    },
    {
      path: [1],
      value: 42,
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(1, 0, 42);
        return arr;
      })(),
    },
    {
      path: [2],
      value: 42,
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(2, 0, 42);
        return arr;
      })(),
    },
    {
      path: [1, 0],
      value: 42,
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(3, 0, 42);
        return arr;
      })(),
    },
    {
      path: [1, 0, 0],
      value: 42,
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(11, 0, 42);
        return arr;
      })(),
    },
    {
      path: [1, 5, 3],
      value: 42,
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(17, 0, 42);
        return arr;
      })(),
    },
    {
      path: [1, 5, 2, 0],
      value: 42,
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(20, 0, 42);
        return arr;
      })(),
    },
    {
      path: [0, 0, 0],
      value: 42,
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(9, 0, 42);
        return arr;
      })(),
    },
    {
      path: [0, 0, 0, 0],
      value: 42,
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(17, 0, 42);
        return arr;
      })(),
    },
  ])("insert($value, $path)", ({ path, value, expectedFlatArray }) => {
    // Arrange

    // Act
    testMultiLevelLinkedList1.insert(value, path);

    // Assert
    const flatArray = testMultiLevelLinkedList1.toFlatArray();
    expect(flatArray).toEqual(expectedFlatArray);
  });

  test.each([
    // Transformation:
    // --------------------------------------------
    // From:
    // 1 - 2
    // |   |
    // 3   4 - 5 - 6 - 7 - 8 - 9
    // |       |               |
    // 10- 11  12- 13- 14      15- 16- 17
    //     |                           |
    //     18- 19- 20                  21- 22
    // --------------------------------------------
    // To:
    // 1 - 2
    // |   |
    // 3   4 - 6 - 7 - 8 - 9
    // |                   |
    // 10- 5 - 11          15- 16- 17
    //     |   |                   |
    //     |   18- 19- 20          21- 22
    //     12- 13- 14
    {
      fromPath: [1, 1],
      toPath: [0, 0, 1],
      expectedFlatArray: [
        1, 2, 3, 4, 6, 7, 8, 9, 10, 5, 11, 15, 16, 17, 12, 13, 14, 18, 19, 20,
        21, 22,
      ],
    },
  ])(
    "moveElement($fromPath, $toPath)",
    ({ fromPath, toPath, expectedFlatArray }) => {
      // Arrange

      // Act
      testMultiLevelLinkedList1.moveElement(fromPath, toPath);

      // Assert
      const flatArray = testMultiLevelLinkedList1.toFlatArray();
      expect(flatArray).toEqual(expectedFlatArray);
    }
  );

  test.each([
    {
      path: [0],
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(17, 3);
        arr.splice(9, 2);
        arr.splice(2, 1);
        arr.splice(0, 1);
        return arr;
      })(),
    },
    {
      path: [1],
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(20, 2);
        arr.splice(11, 6);
        arr.splice(3, 6);
        arr.splice(1, 1);
        return arr;
      })(),
    },
    {
      path: [2],
      expectedFlatArray: getTestMultiLevelLinkedList1Flat(),
    },
    {
      path: [1, 0],
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(3, 1);
        return arr;
      })(),
    },
    {
      path: [1, 0, 0],
      expectedFlatArray: getTestMultiLevelLinkedList1Flat(),
    },
    {
      path: [1, 5, 1],
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(15, 1);
        return arr;
      })(),
    },
    {
      path: [1, 5, 0],
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(14, 1);
        return arr;
      })(),
    },
    {
      path: [0, 0, 0],
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(9, 1);
        return arr;
      })(),
    },
  ])("dropElement($path)", ({ path, expectedFlatArray }) => {
    // Arrange

    // Act
    testMultiLevelLinkedList1.dropElement(path);

    // Assert
    const flatArray = testMultiLevelLinkedList1.toFlatArray();
    expect(flatArray).toEqual(expectedFlatArray);
  });

  test.each([
    {
      layer: 0,
      expectedFlatArray: [],
    },
    {
      layer: 1,
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(2);
        return arr;
      })(),
    },
    {
      layer: 2,
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(9);
        return arr;
      })(),
    },
    {
      layer: 3,
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(17);
        return arr;
      })(),
    },
    {
      layer: 4,
      expectedFlatArray: getTestMultiLevelLinkedList1Flat(),
    },
    {
      layer: 5,
      expectedFlatArray: getTestMultiLevelLinkedList1Flat(),
    },
  ])("dropLayer($layer)", ({ layer, expectedFlatArray }) => {
    // Arrange

    // Act
    testMultiLevelLinkedList1.dropLayer(layer);

    // Assert
    const flatArray = testMultiLevelLinkedList1.toFlatArray();
    expect(flatArray).toEqual(expectedFlatArray);
  });

  test.each([
    {
      path: [],
      expectedFlatArray: [],
    },
    {
      path: [0],
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(17, 3);
        arr.splice(9, 2);
        arr.splice(2, 1);
        return arr;
      })(),
    },
    {
      path: [1],
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(20, 2);
        arr.splice(11, 6);
        arr.splice(3, 6);
        return arr;
      })(),
    },
    {
      path: [1, 5, 1],
      expectedFlatArray: getTestMultiLevelLinkedList1Flat(),
    },
    {
      path: [0, 0, 1],
      expectedFlatArray: (() => {
        const arr = getTestMultiLevelLinkedList1Flat();
        arr.splice(17, 3);
        return arr;
      })(),
    },
  ])("dropBranch($path)", ({ path, expectedFlatArray }) => {
    // Arrange

    // Act
    testMultiLevelLinkedList1.dropBranch(path);

    // Assert
    const flatArray = testMultiLevelLinkedList1.toFlatArray();
    expect(flatArray).toEqual(expectedFlatArray);
  });

  test("clone()", () => {
    // Arrange

    // Act
    const cloned = testMultiLevelLinkedList1.clone();

    // Assert
    testMultiLevelLinkedList1.insert(1, [0]);
    const clonedFlatArray = cloned.toFlatArray();
    const flatArray = testMultiLevelLinkedList1.toFlatArray();

    expect(clonedFlatArray).not.toEqual(flatArray);
  });

  test("clone() should clone empty list", () => {
    // Arrange
    const multiLevelLinkedList = new MultiLevelLinkedList();

    // Act
    const cloned = multiLevelLinkedList.clone();

    // Assert
    multiLevelLinkedList.insert(1, [0]);
    const clonedFlatArray = cloned.toFlatArray();
    const flatArray = multiLevelLinkedList.toFlatArray();

    expect(clonedFlatArray).not.toEqual(flatArray);
  });

  test("clone() should not shallow clone", () => {
    // Arrange
    const expectedFlatArray = testMultiLevelLinkedList1.toFlatArray();

    // Act
    const cloned = testMultiLevelLinkedList1.clone();

    // Assert
    const clonedFlatArray = cloned.toFlatArray();

    expect(cloned).not.toBe(testMultiLevelLinkedList1);
    expect(clonedFlatArray).toEqual(expectedFlatArray);
  });

  test("clear()", () => {
    // Arrange
    const expectedFlatArray: unknown = [];

    // Act
    testMultiLevelLinkedList1.clear();

    // Assert
    const flatArray = testMultiLevelLinkedList1.toFlatArray();
    expect(flatArray).toEqual(expectedFlatArray);
  });
});
