import { inject, provide, type InjectionKey } from 'vue';

export function provideApi<T>(key: InjectionKey<T> | string | number, api: T) {
  provide(key, api);
}

export function useApi<T>(key: InjectionKey<T> | string): T | undefined {
  return inject(key, undefined);
}
