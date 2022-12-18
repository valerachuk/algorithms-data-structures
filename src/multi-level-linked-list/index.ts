import { getNodeAt } from "./utils";

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

  public get(path: Array<number>): TValue {
    let currentNode = this._root;

    for (let i = 0; i < path.length; i++) {
      const elementIndex = path[i];
      if (currentNode === null) {
        throw new RangeError(`Got null at index: ${elementIndex}`);
      }

      currentNode = getNodeAt(currentNode, elementIndex);

      if (i === path.length - 1) {
        return currentNode.value;
      }

      currentNode = currentNode.child;
    }

    throw new Error("Path must be non-empty");
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
}
