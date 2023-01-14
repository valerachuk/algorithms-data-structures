/**
 * A node of a SkipList.
 */
class SkipListNode {
  private readonly _value: number;
  private readonly _forward: Array<SkipListNode | null>;

  public get value() {
    return this._value;
  }

  public get forward() {
    return this._forward;
  }

  constructor(value: number, level: number) {
    this._value = value;
    this._forward = new Array(level + 1).fill(null);
  }

  public getLevel() {
    return this.forward.length - 1;
  }
}

/**
 * SkipList configuration.
 */
export type SkipListDef = {
  maxLvl: number;
  p: number;
};

/**
 * Implementation of a skip list.
 */
export class SkipList {
  private readonly _def: SkipListDef;
  private readonly _header: SkipListNode;
  private _currentLevel: number;

  constructor(def: SkipListDef);
  constructor();

  constructor(def?: SkipListDef) {
    this._def = def ?? {
      maxLvl: 10,
      p: 1 / 2,
    };

    this._currentLevel = 0;
    this._header = new SkipListNode(Number.NEGATIVE_INFINITY, this._def.maxLvl);
  }

  /**
   * Inserts the specified value if not exists.
   * @param value The value to insert.
   */
  public insert(value: number): void {
    const randomLevel = this._generateRandomLevel();
    this._insert(value, randomLevel);
  }

  /**
   * Deletes the specified value.
   * @param value The value to delete.
   * @returns `true` if found and deleted; otherwise, `false`.
   */
  public delete(value: number): boolean {
    let current: SkipListNode | null = this._header;
    const update: Array<SkipListNode> = [];

    for (let i = this._currentLevel; i >= 0; i--) {
      while (
        current !== null &&
        current.forward[i] !== null &&
        current.forward[i]!.value < value
      ) {
        current = current.forward[i];
      }

      update[i] = current!;
    }

    current = current?.forward[0] ?? null;

    if (current === null || current.value !== value) {
      // not found
      return false;
    }

    for (let i = 0; i <= this._currentLevel; i++) {
      if (update[i].forward[i] !== current) {
        break;
      }

      update[i].forward[i] = current.forward[i];
    }

    while (this._currentLevel > 0 && this._header.forward[this._currentLevel]) {
      this._currentLevel--;
    }

    return true;
  }

  /**
   * Searches for the specified value.
   * @param value the value to find.
   * @returns `true` if found; otherwise, `false`.
   */
  public has(value: number): boolean {
    let current: SkipListNode | null = this._header;
    for (let i = this._currentLevel; i >= 0; i--) {
      while (
        current !== null &&
        current.forward[i] !== null &&
        current.forward[i]!.value < value
      ) {
        current = current.forward[i];
      }
    }

    current = current?.forward[0] ?? null;

    return current !== null && current.value === value;
  }

  /**
   * Removes all the elements from the skip list.
   */
  public clear(): void {
    const { forward } = this._header;

    for (let i = 0; i < forward.length; i++) {
      forward[i] = null;
    }
  }

  /**
   * Converts the skip list to array.
   * @returns An array of the skip list's values.
   */
  public toArray(): Array<number> {
    const arr: Array<number> = [];

    let current = this._header.forward[0];

    while (current !== null) {
      arr.push(current.value);
      current = current.forward[0];
    }

    return arr;
  }

  /**
   * Clones the slip list.
   * @returns A new instance of skip list.
   */
  public clone(): SkipList {
    const clone = new SkipList(this._def);

    let current = this._header.forward[0];

    while (current !== null) {
      clone._insert(current.value, current.getLevel());
      current = current.forward[0];
    }

    return clone;
  }

  /**
   * Returns the total number of elements in the skip list.
   * @returns The total number of elements in the skip list.
   */
  public size(): number {
    let current = this._header.forward[0];

    let count = 0;
    while (current !== null) {
      count++;
      current = current.forward[0];
    }

    return count;
  }

  /**
   * Returns the total number of forward pointers in the skip list.
   * @returns The total number of forward pointers in the skip list.
   */
  public totalPointers(): number {
    let current = this._header.forward[0];

    let count = 0;
    while (current !== null) {
      count += current.forward.length;
      current = current.forward[0];
    }

    return count;
  }

  private _insert(value: number, level: number) {
    let current: SkipListNode | null = this._header;
    const update: Array<SkipListNode> = [];

    for (let i = this._currentLevel; i >= 0; i--) {
      while (
        current !== null &&
        current.forward[i] !== null &&
        current.forward[i]!.value < value
      ) {
        current = current.forward[i];
      }

      update[i] = current!;
    }

    current = current?.forward[0] ?? null;

    if (current !== null && current.value === value) {
      return;
    }

    if (level > this._currentLevel) {
      for (let i = this._currentLevel + 1; i <= level; i++) {
        update[i] = this._header;
      }

      this._currentLevel = level;
    }

    const newNode = new SkipListNode(value, level);

    for (let i = 0; i <= level; i++) {
      newNode.forward[i] = update[i].forward[i];
      update[i].forward[i] = newNode;
    }
  }

  private _generateRandomLevel(): number {
    let random = Math.random();
    let level = 0;

    while (random < this._def.p && level < this._def.maxLvl) {
      level++;
      random = Math.random();
    }

    return level;
  }
}
