interface Node<T> {
  value: T;
  prev: Node<T>;
  next: Node<T>;
  weight: number;
}

export class Dequeue<T> {
  private _length = 0;
  private _weight = undefined;
  private head: Node<T> = undefined;
  private tail: Node<T> = undefined;

  get length() {
    return this._length;
  }

  get weight() {
    return this._weight;
  }

  clear() {
    this.head = this.tail = undefined;
    this._length = 0;
    this._weight = undefined;
  }

  push(value: T, weight: number = 0) {
    const newNode: Node<T> = {
      value,
      prev: this.tail,
      next: undefined,
      weight,
    };

    if (this._length) {
      this.tail.next = newNode;
      this.tail = newNode;
    } else {
      this.head = this.tail = newNode;
    }
    this._length++;
    this._weight += weight;
  }

  pop(): T {
    if (!this._length) {
      return undefined;
    }
    const result = this.tail;
    this.tail = this.tail.prev;
    this._length--;
    this._weight -= result.weight;
    if (!this._length) {
      this.head = this.tail = undefined;
      this._weight = undefined;
    }
    return result.value;
  }

  unshift(value: T, weight: number = 0) {
    const newNode: Node<T> = {
      value,
      prev: undefined,
      next: this.head,
      weight,
    };

    if (this._length) {
      this.head.prev = newNode;
      this.head = newNode;
    } else {
      this.head = this.tail = newNode;
    }

    this._length++;
    this._weight += weight;
  }

  shift(): T {
    if (!this._length) {
      return undefined;
    }
    const result = this.head;
    this.head = this.head.next;
    this._length--;
    this._weight -= result.weight;
    if (!this._length) {
      this.head = this.tail = undefined;
      this._weight = undefined;
    }
    return result.value;
  }

  peekFront(): T {
    if (this._length) {
      return this.head.value;
    }
    return undefined;
  }

  peekBack(): T {
    if (this._length) {
      return this.tail.value;
    }
    return undefined;
  }
}
