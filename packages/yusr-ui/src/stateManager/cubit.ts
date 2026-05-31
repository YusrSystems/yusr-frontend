import { signal, type Signal } from "@preact/signals";

export class Cubit<TState> {
  readonly state: Signal<TState>;

  constructor(initialState: TState) {
    this.state = signal<TState>(initialState);
  }

  protected emit(newState: TState) {
    this.state.value = newState;
  }
}