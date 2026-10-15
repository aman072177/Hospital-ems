// ---------- Singly linked list: permanent patient records ----------
class RecordNode {
  constructor(data) { this.data = data; this.next = null; }
}

class PatientList {
  constructor() { this.head = null; this.size = 0; }

  add(data) {                       // append at tail, O(n)
    const node = new RecordNode(data);
    if (!this.head) this.head = node;
    else { let c = this.head; while (c.next) c = c.next; c.next = node; }
    this.size++;
    return node.data;
  }

  find(id) {
    for (let c = this.head; c; c = c.next) if (c.data.id === id) return c.data;
    return null;
  }

  remove(id) {
    if (!this.head) return false;
    if (this.head.data.id === id) { this.head = this.head.next; this.size--; return true; }
    for (let c = this.head; c.next; c = c.next) {
      if (c.next.data.id === id) { c.next = c.next.next; this.size--; return true; }
    }
    return false;
  }

  toArray() {
    const out = [];
    for (let c = this.head; c; c = c.next) out.push(c.data);
    return out;
  }
}

// ---------- Queue (linked nodes, FIFO) ----------
class Queue {
  constructor() { this.front = null; this.rear = null; this.size = 0; }
  enqueue(item) {
    const n = { item, next: null };
    if (this.rear) this.rear.next = n; else this.front = n;
    this.rear = n; this.size++;
  }
  dequeue() {
    if (!this.front) return null;
    const { item } = this.front;
    this.front = this.front.next;
    if (!this.front) this.rear = null;
    this.size--;
    return item;
  }
  remove(id) {                      // used when a patient is discharged early
    let prev = null;
    for (let c = this.front; c; prev = c, c = c.next) {
      if (c.item === id) {
        if (prev) prev.next = c.next; else this.front = c.next;
        if (c === this.rear) this.rear = prev;
        this.size--; return true;
      }
    }
    return false;
  }
  toArray() { const o = []; for (let c = this.front; c; c = c.next) o.push(c.item); return o; }
}

// ---------- Two-level priority queue: emergency first, normal FIFO ----------
class TriageQueue {
  constructor() { this.emergency = new Queue(); this.normal = new Queue(); }
  enqueue(id, priority) { (priority === 'emergency' ? this.emergency : this.normal).enqueue(id); }
  dequeue() { return this.emergency.dequeue() ?? this.normal.dequeue(); }
  remove(id) { return this.emergency.remove(id) || this.normal.remove(id); }
  order() { return [...this.emergency.toArray(), ...this.normal.toArray()]; }
}

module.exports = { PatientList, TriageQueue };
