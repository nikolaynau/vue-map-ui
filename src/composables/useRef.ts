import { computed, ref } from 'vue';
import { isDefined } from '@vueuse/shared';

export function useRef<T = unknown, V = unknown>(fn: (obj: T) => V) {
  const templateRef = ref<T | null>(null);
  const value = computed<V | null>(() =>
    isDefined(templateRef) ? fn(templateRef.value as T) : null
  );
  return { templateRef, value };
}

export type UseRefReturn = ReturnType<typeof useRef>;
