import { inject, provide, readonly, type Ref } from 'vue';
import type { Control } from 'leaflet';
import { controlKey } from '../utils/injectionSymbols';

export function provideControl(control: Ref<Control | null>) {
  provide(controlKey, readonly(control));
}

export function useControl<T extends Control = Control>(): Ref<T | null> {
  return inject(controlKey, undefined) as Ref<T | null>;
}
