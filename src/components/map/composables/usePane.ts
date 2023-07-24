import { inject, provide, readonly, type Ref } from 'vue';
import { paneKey } from './injectionSymbols';

export function providePane(pane: Ref<HTMLElement | null>) {
  provide(paneKey, readonly(pane) as Ref<HTMLElement | null>);
}

export function usePane(): Ref<HTMLElement | null> | undefined {
  return inject(paneKey, undefined);
}
