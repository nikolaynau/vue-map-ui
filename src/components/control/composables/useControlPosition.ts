import { inject, provide, readonly, type Ref } from 'vue';
import { controlPositionKey } from './injectionSymbols';

export function provideControlPosition(
  positionElement: Ref<HTMLElement | null>
) {
  provide(
    controlPositionKey,
    readonly(positionElement) as Ref<HTMLElement | null>
  );
}

export function useControlPosition(): Ref<HTMLElement | null> | undefined {
  return inject(controlPositionKey, undefined);
}
