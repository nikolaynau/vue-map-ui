import { inject, provide, readonly, type Ref } from 'vue';
import type { Icon } from 'leaflet';
import { iconKey } from './injectionSymbols';

export function provideIcon(icon: Ref<Icon | null>) {
  provide(iconKey, readonly(icon) as Ref<Icon | null>);
}

export function useIcon(): Ref<Icon | null> | undefined {
  return inject(iconKey, undefined);
}
