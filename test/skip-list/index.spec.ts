import { sortNumericArr } from "../../src/common/utils";
import { SkipList } from "../../src/skip-list";

const getTestSkipListElements = () => [...new Array(100).keys()];

describe("Skip list", () => {
  let testSkipList: SkipList = null!;

  beforeEach(() => {
    testSkipList = new SkipList();
    for (const i of getTestSkipListElements()) {
      testSkipList.insert(i);
    }
  });

  test.each(getTestSkipListElements().map((x) => x + 0.5))(
    "insert(%d)",
    (x) => {
      // Arrange
      const expectedArr = getTestSkipListElements();
      expectedArr.push(x);
      sortNumericArr(expectedArr);

      // Act
      testSkipList.insert(x);

      // Assert
      const arr = testSkipList.toArray();
      expect(arr).toEqual(expectedArr);
    }
  );

  test.each(getTestSkipListElements())("delete(%d)", (x) => {
    // Arrange
    const expectedArr = getTestSkipListElements().filter(
      (value) => value !== x
    );

    // Act
    testSkipList.delete(x);

    // Assert
    const arr = testSkipList.toArray();
    expect(arr).toEqual(expectedArr);
  });

  test.each(
    (() => {
      const arr = getTestSkipListElements().map((x) => ({
        value: x,
        expectedHas: true,
      }));

      arr.push(
        ...[
          { value: -1, expectedHas: false },
          { value: 10_000, expectedHas: false },
        ]
      );

      return arr;
    })()
  )("has($value) == $expectedHas", ({ value, expectedHas }) => {
    // Arrange

    // Act
    const has = testSkipList.has(value);

    // Assert
    expect(has).toBe(expectedHas);
  });

  test("clear()", () => {
    // Arrange

    // Act
    testSkipList.clear();

    // Assert
    const arr = testSkipList.toArray();
    expect(arr).toEqual([]);
  });

  test("clone()", () => {
    // Arrange

    // Act
    const clone = testSkipList.clone();

    // Assert
    testSkipList.insert(-1);
    const clonedArr = clone.toArray();
    const arr = testSkipList.toArray();

    expect(clonedArr).not.toEqual(arr);
  });

  test("clone() should clone empty list", () => {
    // Arrange
    const skipList = new SkipList();

    // Act
    const cloned = skipList.clone();

    // Assert
    skipList.insert(-1);
    const clonedArr = cloned.toArray();
    const arr = skipList.toArray();

    expect(clonedArr).not.toEqual(arr);
  });

  test("clone() should not shallow clone", () => {
    // Arrange
    const expectedArr = testSkipList.toArray();

    // Act
    const cloned = testSkipList.clone();

    // Assert
    const clonedArr = cloned.toArray();

    expect(cloned).not.toBe(testSkipList);
    expect(clonedArr).toEqual(expectedArr);
  });

  test("toArray", () => {
    // Arrange
    const expectedArr = getTestSkipListElements();

    // Act
    const arr = testSkipList.toArray();

    // Assert
    expect(arr).toEqual(expectedArr);
  });

  test("size()", () => {
    // Arrange
    const expectedSize = 100;

    // Act
    const size = testSkipList.size();

    // Assert
    expect(size).toEqual(expectedSize);
  });

  // test("totalPointers()", () => {
  //   // Arrange

  //   // Act
  //   const totalPointers = testSkipList.totalPointers();

  //   // Assert
  //   console.log(totalPointers);
  // });
});
