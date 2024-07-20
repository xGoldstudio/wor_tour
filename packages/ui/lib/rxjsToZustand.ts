import { Observable } from 'rxjs';
import { UseBoundStore, StoreApi } from 'zustand';
// store should have a key Key of type T
export function toState<Store extends object, K extends keyof Store>(
  store: UseBoundStore<StoreApi<Store>>,
  key: K,
  observable: Observable<Store[K]>
) {
  observable.subscribe((value) => {
    store.setState({ [key]: value } as unknown as Partial<Store>);
  });
}