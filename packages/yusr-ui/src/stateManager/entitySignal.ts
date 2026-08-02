import { Signal } from "@preact/signals-react";

export class EntitySignal<T> extends Signal<T>
{
  onWrite: (value: T) => void;

  constructor(value: T, onWrite: (value: T) => void)
  {
    super(value);
    this.onWrite = onWrite;
  }

  set value(newValue: T)
  {
    if (this.peek() !== newValue)
    {
      super.value = newValue;
      this.onWrite(newValue);
    }
  }

  get value(): T
  {
    return super.value;
  }
}
