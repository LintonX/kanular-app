interface Stack<T> {
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
    isEmpty(): boolean;
    clear(): void;
}

export class BoardViewStack implements Stack<string> {

    private stack: string[] = [];

    constructor(initialItems: string[] = []) {
        this.stack = [...initialItems];
    }

    push(item: string): void {
        this.stack.push(item);
    }
    pop(): string | undefined {
        return this.stack.pop();
    }
    peek(): string | undefined {
        return this.stack[this.size() - 1];
    }
    size(): number {
        return this.stack.length;
    }
    isEmpty(): boolean {
        return this.size() === 0;
    }
    clear(): void {
        this.stack = [];
    }
    toJSON(): object {
        return { stack: [...this.stack] };
    }
    static fromJSON(obj: { stack: string[] }): BoardViewStack {
        return new BoardViewStack(obj.stack);
    }
}