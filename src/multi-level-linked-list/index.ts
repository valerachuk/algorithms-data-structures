import { getNodeAt } from "./utils";

export type MultiLevelLinkedListPath = Array<number>;

/**
 * An interface, describing a node of MLLL.
 */
export interface LinkedListNode<TValue> {
  value: TValue;
  next: LinkedListNode<TValue> | null;
  child: LinkedListNode<TValue> | null;
}

/**
 * Implementation of multi level linked list (next - MLLL).
 */
export class MultiLevelLinkedList<TValue> {
  private _root: LinkedListNode<TValue> | null = null;

  /**
   * Creates a multi level linked list from the specified node.
   * @param root the root to crete an instance from.
   * @returns A new instance of {@link MultiLevelLinkedList<TValue>}.
   */
  public static fromRootNode<TValue>(
    root: LinkedListNode<TValue> | null
  ): MultiLevelLinkedList<TValue> {
    const instance = new MultiLevelLinkedList<TValue>();
    instance._root = root;

    return instance;
  }

  /**
   * Returns total count of elements in the MLLL.
   * @returns total count of elements in the MLLL.
   */
  public count(): number {
    const getCountOnLayer = (
      layerRoot: LinkedListNode<TValue> | null
    ): number => {
      let currentNode = layerRoot;
      let currentCount = 0;

      while (currentNode !== null) {
        currentCount++;
        if (currentNode.child !== null) {
          currentCount += getCountOnLayer(currentNode.child);
        }

        currentNode = currentNode.next;
      }

      return currentCount;
    };

    return getCountOnLayer(this._root);
  }

  /**
   * Returns count of elements on the specified layer.
   * @param layerIndex layer index to count elements on.
   * @returns count of elements on the specified layer.
   */
  public countOnLayer(layerIndex: number): number {
    const getCountOnLayer = (
      layerRoot: LinkedListNode<TValue> | null,
      currentIndex: number
    ) => {
      let currentNode = layerRoot;
      let currentCount = 0;

      while (currentNode !== null) {
        if (layerIndex === currentIndex) {
          currentCount++;
        }

        if (currentNode.child !== null && currentIndex < layerIndex) {
          currentCount += getCountOnLayer(currentNode.child, currentIndex + 1);
        }

        currentNode = currentNode.next;
      }

      return currentCount;
    };

    return getCountOnLayer(this._root, 0);
  }

  /**
   * Checks whether the MLLL contains specified value.
   * @param value the value to search.
   * @returns `true` if the MLLL contains specified value; otherwise, `false`.
   */
  public has(value: TValue): boolean {
    const foundNode = this._findNode(value);
    return foundNode !== null;
  }

  /**
   * Returns value by the specified path.
   * @param path the path to get the value from.
   * @returns value by the specified path.
   */
  public getValue(path: MultiLevelLinkedListPath): TValue {
    return this._getNode(path).value;
  }

  /**
   * Inserts value at the specified path to the MLLL.
   * @param value the value to insert.
   * @param path to path to insert at.
   */
  public insert(value: TValue, path: MultiLevelLinkedListPath): void {
    this._insertNode({ value, child: null }, path);
  }

  /**
   * Inserts the specified `value` after the first found `insertAfterValue`.
   * @param value the value to insert.
   * @param insertAfterValue the value to insert the specified `value` after.
   * @returns `true` if the `insertAfterValue` has been found; otherwise, `false`.
   */
  public insertAfterFirstValue(
    value: TValue,
    insertAfterValue: TValue
  ): boolean {
    const leftSibling = this._findNode(insertAfterValue);

    if (leftSibling === null) {
      return false;
    }

    const newNode: LinkedListNode<TValue> = {
      value,
      next: leftSibling.next,
      child: null,
    };

    leftSibling.next = newNode;

    return true;
  }

  /**
   * Moves the element at `fromPath` to `toPath`.
   * @param fromPath the path to move the element from.
   * @param toPath the path to move the element to.
   */
  public moveElement(
    fromPath: MultiLevelLinkedListPath,
    toPath: MultiLevelLinkedListPath
  ): void {
    const { value, child } = this._getNode(fromPath);
    this._insertNode({ value, child }, toPath);
    this.dropElement(fromPath);
  }

  public dropElement(path: MultiLevelLinkedListPath): void {
    if (path.length === 0) {
      throw new Error("path must be non-empty");
    }

    // Handle root edge case
    if (path.length === 1 && path[0] === 0) {
      this._root = this._root?.next ?? null;
      return;
    }

    let leftSibling: LinkedListNode<TValue>;
    const lastLevelIndex = path.at(-1)!;

    if (path.length === 1) {
      if (this._root === null) {
        throw new Error(`Root must be not null`);
      }
      leftSibling = getNodeAt(this._root, lastLevelIndex - 1);
    } else {
      const lastLayerParentNode = this._getNode(path.slice(0, -1));

      // Handle parent layer edge case
      if (lastLevelIndex === 0) {
        lastLayerParentNode.child = lastLayerParentNode.child?.next ?? null;
        return;
      }

      if (lastLayerParentNode.child === null) {
        throw new Error(
          `The requested element at layer ${path.length - 1} doesn't exist`
        );
      }

      leftSibling = getNodeAt(lastLayerParentNode.child, lastLevelIndex - 1);
    }

    leftSibling.next = leftSibling.next?.next ?? null;
  }

  /**
   * Removes layer and deeper layers by the specified index.
   * @param layerIndex the index of layer to remove.
   */
  public dropLayer(layerIndex: number): void {
    if (layerIndex === 0) {
      this._root = null;
      return;
    }

    const dropLayer = (
      layerRoot: LinkedListNode<TValue> | null,
      currentIndex: number
    ) => {
      let currentNode = layerRoot;

      while (currentNode !== null) {
        if (currentIndex === layerIndex - 1) {
          currentNode.child = null;
        }

        if (currentNode.child !== null) {
          dropLayer(currentNode.child, currentIndex + 1);
        }

        currentNode = currentNode.next;
      }
    };

    dropLayer(this._root, 0);
  }

  /**
   * Sets child reference to null of the specified node
   * @param path path of the parent node to drop the child of
   */
  public dropBranch(path: MultiLevelLinkedListPath): void {
    if (path.length === 0) {
      this._root = null;
      return;
    }

    const parentNode = this._getNode(path);
    parentNode.child = null;
  }

  /**
   * Clones to MLLL.
   * @returns A new instance of MLLL.
   */
  public clone(): MultiLevelLinkedList<TValue> {
    const copyNode = (value: TValue): LinkedListNode<TValue> => {
      return {
        value,
        next: null,
        child: null,
      };
    };

    const cloneBranch = (layerRoot: LinkedListNode<TValue> | null) => {
      let clonedRoot: typeof layerRoot | null = null;

      let currentNode: typeof layerRoot | null = layerRoot;
      let lastNodeCopy: typeof layerRoot | null = null;

      while (currentNode !== null) {
        const nodeCopy = copyNode(currentNode.value);
        nodeCopy.child = cloneBranch(currentNode.child);

        if (lastNodeCopy !== null) {
          lastNodeCopy.next = nodeCopy;
        } else {
          clonedRoot = nodeCopy;
        }

        lastNodeCopy = nodeCopy;
        currentNode = currentNode.next;
      }

      return clonedRoot;
    };

    const copiedRoot = cloneBranch(this._root);

    return MultiLevelLinkedList.fromRootNode(copiedRoot);
  }

  /**
   * Removes all elements from the MLLL.
   */
  public clear(): void {
    this._root = null;
  }

  /**
   * Warning: draft, non-efficient solution for testing
   */
  public toFlatArray(): Array<TValue> {
    const flatLayers: Array<Array<TValue>> = [];

    const flattenLayer = (
      layerRoot: LinkedListNode<TValue> | null,
      layerIndex: number
    ): void => {
      const childrenRoots: Array<LinkedListNode<TValue>> = [];

      const valuesByLayer = (flatLayers[layerIndex] =
        flatLayers[layerIndex] ?? []);

      let currentNode = layerRoot;
      while (currentNode !== null) {
        const { child } = currentNode;
        if (child !== null) {
          childrenRoots.push(child);
        }

        valuesByLayer.push(currentNode.value);

        currentNode = currentNode.next;
      }

      childrenRoots.forEach((layerRoot) =>
        flattenLayer(layerRoot, layerIndex + 1)
      );
    };

    flattenLayer(this._root, 0);
    return flatLayers.flat();
  }

  private _getNode(path: MultiLevelLinkedListPath): LinkedListNode<TValue> {
    if (this._root === null) {
      throw new Error(`Root must be not null`);
    }
    let currentNode: LinkedListNode<TValue> = this._root;

    for (let i = 0; i < path.length - 1; i++) {
      const elementIndex = path[i];

      currentNode = getNodeAt(currentNode, elementIndex);

      const { child } = currentNode;
      if (child === null) {
        throw new Error(`Child is null at index: ${elementIndex}, layer: ${i}`);
      }

      currentNode = child;
    }

    return getNodeAt(currentNode, path.at(-1)!);
  }

  private _insertNode(
    node: Omit<LinkedListNode<TValue>, "next">,
    path: MultiLevelLinkedListPath
  ): void {
    if (path.length === 0) {
      throw new Error("path must be non-empty");
    }

    const newNode: LinkedListNode<TValue> = {
      ...node,
      next: null,
    };

    // Handle root edge case
    if (path.length === 1 && path[0] === 0) {
      newNode.next = this._root;
      this._root = newNode;
      return;
    }

    let leftSibling: LinkedListNode<TValue>;
    const lastLevelIndex = path.at(-1)!;

    if (path.length === 1) {
      if (this._root === null) {
        throw new Error(`Root must be not null`);
      }
      leftSibling = getNodeAt(this._root, lastLevelIndex - 1);
    } else {
      const lastLayerParentNode = this._getNode(path.slice(0, -1));

      // Handle parent layer edge case
      if (lastLevelIndex === 0) {
        newNode.next = lastLayerParentNode.child;
        lastLayerParentNode.child = newNode;
        return;
      }

      if (lastLayerParentNode.child === null) {
        throw new Error(
          `The requested element at layer ${path.length - 1} doesn't exist`
        );
      }

      leftSibling = getNodeAt(lastLayerParentNode.child, lastLevelIndex - 1);
    }

    newNode.next = leftSibling.next;
    leftSibling.next = newNode;
  }

  private _findNode(value: TValue): LinkedListNode<TValue> | null {
    const findNode = (
      layerRoot: LinkedListNode<TValue> | null
    ): LinkedListNode<TValue> | null => {
      let current = layerRoot;

      while (current != null) {
        if (Object.is(value, current.value)) {
          return current;
        }

        const foundNode = findNode(current.child);
        if (foundNode !== null) {
          return foundNode;
        }

        current = current.next;
      }

      return null;
    };

    return findNode(this._root);
  }
}
