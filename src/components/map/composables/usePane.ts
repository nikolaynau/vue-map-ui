import { inject, provide, readonly, type Ref } from 'vue';
import { paneKey } from './injectionSymbols';

export function providePane(pane: Ref<HTMLElement | null>) {
  provide(paneKey, readonly(pane));
}

export function usePane(): Ref<HTMLElement | null> {
  return inject(paneKey, undefined) as Ref<HTMLElement | null>;
}
