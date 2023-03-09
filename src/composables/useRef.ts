import { isDefined } from '@vueuse/shared';
import { computed, ref } from 'vue';

export function useRef<
  T extends abstract new (...args: any) => unknown,
  V = unknown
>(fn: (obj: InstanceType<T>) => V) {
  const templateRef = ref<InstanceType<T> | null>(null);
  const value = computed<V | null>(() =>
    isDefined(templateRef) ? fn(templateRef.value as InstanceType<T>) : null
  );
  return { templateRef, value };
}

export type UseRefReturn = ReturnType<typeof useRef>;
