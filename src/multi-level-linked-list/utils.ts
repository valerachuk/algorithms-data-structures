import { LinkedListNode } from ".";

export const arrayToFlatLinkedList = <TValue>(
  ...arr: ReadonlyArray<TValue>
): LinkedListNode<TValue> | null => {
  let currentNode: LinkedListNode<TValue> | null = null;

  for (let i = arr.length - 1; i >= 0; i--) {
    let value = arr[i];

    const newNode: LinkedListNode<TValue> = {
      value,
      child: null,
      next: null,
    };

    if (currentNode === null) {
      currentNode = newNode;
    } else {
      newNode.next = currentNode;
      currentNode = newNode;
    }
  }

  return currentNode;
};

export const getNodeAt = <TValue>(
  root: LinkedListNode<TValue>,
  index: number
): LinkedListNode<TValue> => {
  let currentNode: typeof root | null = root;

  for (let i = 0; i < index; i++) {
    if (currentNode === null) {
      throw new RangeError(`Got null at index: ${i}`);
    }

    currentNode = currentNode.next;
  }

  if (currentNode === null) {
    throw new RangeError(`Got null at index: ${index}`);
  }

  return currentNode;
};
