import { fisherYatesShuffle, randomInt } from "../../src/common/utils";
import {
  LinkedListNode,
  MultiLevelLinkedList,
  MultiLevelLinkedListPath,
} from "../../src/multi-level-linked-list";

/**
 * Generates a random multi level linked list of the following shape:
 * [size % 100, 9, 10]
 */
export const generateRandomMultiLevelLinkedList = (
  size: number
): MultiLevelLinkedList<number> => {
  if (size % 100 !== 0) {
    throw new Error("Size should be multiple of 100.");
  }

  const randomNumbers = new Array(size);
  for (let i = 0; i < size; i++) {
    randomNumbers[i] = i;
  }
  fisherYatesShuffle(randomNumbers);

  const createNewNode = (): LinkedListNode<number> => {
    return {
      value: randomNumbers.pop(),
      child: null,
      next: null,
    };
  };

  const generateLevel3Item = () => {
    const level3ListSize = 10;

    let layerRoot: LinkedListNode<number> = null!;
    let current: LinkedListNode<number> = null!;

    for (let i = 0; i < level3ListSize; i++) {
      const newNode = createNewNode();

      if (layerRoot === null) {
        layerRoot = newNode;
      }

      if (current !== null) {
        current.next = newNode;
      }

      current = newNode;
    }

    return layerRoot;
  };

  const generateLevel2Item = () => {
    const level2ListSize = 9;

    let layerRoot: LinkedListNode<number> = null!;
    let current: LinkedListNode<number> = null!;

    for (let i = 0; i < level2ListSize; i++) {
      const newNode = createNewNode();

      newNode.child = generateLevel3Item();

      if (layerRoot === null) {
        layerRoot = newNode;
      }

      if (current !== null) {
        current.next = newNode;
      }

      current = newNode;
    }

    return layerRoot;
  };

  let layerRoot: LinkedListNode<number> = null!;
  let current: LinkedListNode<number> = null!;

  while (randomNumbers.length !== 0) {
    const newNode = createNewNode();

    newNode.child = generateLevel2Item();

    if (layerRoot === null) {
      layerRoot = newNode;
    }

    if (current !== null) {
      current.next = newNode;
    }

    current = newNode;
  }

  return MultiLevelLinkedList.fromRootNode(layerRoot);
};

export const generateRandomPath = (
  listSize: number
): MultiLevelLinkedListPath => {
  const maxElementsPerLayer = [listSize, 9, 10];

  const layerCount = randomInt(3) + 1;

  const randomPath: Array<number> = [];

  for (let i = 0; i < layerCount; i++) {
    const maxItem = maxElementsPerLayer.shift();
    const random = randomInt(maxItem!);
    randomPath.push(random);
  }

  return randomPath;
};
