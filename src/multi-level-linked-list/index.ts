import { getNodeAt } from "./utils";

export type MultiLevelLinkedListPath = Array<number>;

export interface LinkedListNode<TValue> {
  value: TValue;
  next: LinkedListNode<TValue> | null;
  child: LinkedListNode<TValue> | null;
}

export class MultiLevelLinkedList<TValue> {
  private _root: LinkedListNode<TValue> | null = null;

  public constructor() {}

  public static fromRootNode<TValue>(
    root: LinkedListNode<TValue>
  ): MultiLevelLinkedList<TValue> {
    const instance = new MultiLevelLinkedList<TValue>();
    instance._root = root;

    return instance;
  }

  public getRoot(): LinkedListNode<TValue> | null {
    return this._root;
  }

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

  public countOnLayer(layerIndex: number): number {
    const getCountOnLayer = (
      currentIndex: number,
      layerRoot: LinkedListNode<TValue> | null
    ) => {
      let currentNode = layerRoot;
      let currentCount = 0;

      while (currentNode !== null) {
        if (layerIndex === currentIndex) {
          currentCount++;
        }

        if (currentNode.child !== null && currentIndex < layerIndex) {
          currentCount += getCountOnLayer(currentIndex + 1, currentNode.child);
        }

        currentNode = currentNode.next;
      }

      return currentCount;
    };

    return getCountOnLayer(0, this._root);
  }

  public getValue(path: MultiLevelLinkedListPath): TValue {
    return this._getNode(path).value;
  }

  public insert(value: TValue, path: MultiLevelLinkedListPath): void {
    if (path.length === 0) {
      throw new Error("path must be non-empty");
    }

    const newNode: LinkedListNode<TValue> = {
      value,
      next: null,
      child: null,
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
      const lastLayerParentNode = this._getLayerParent(path);

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

  private _getLayerParent(
    path: MultiLevelLinkedListPath
  ): LinkedListNode<TValue> {
    if (path.length < 2) {
      throw new RangeError(
        "The path has length < 2, root reference cannot be a parent node"
      );
    }

    if (this._root === null) {
      throw new Error(`Root must be not null`);
    }
    let currentNode: LinkedListNode<TValue> = this._root;

    for (let i = 0; i < path.length - 2; i++) {
      const elementIndex = path[i];

      currentNode = getNodeAt(currentNode, elementIndex);

      const { child } = currentNode;
      if (child === null) {
        throw new Error(`Child is null at index: ${elementIndex}, layer: ${i}`);
      }

      currentNode = child;
    }

    return getNodeAt(currentNode, path.at(-2)!);
  }
}
