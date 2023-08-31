import { computed, ref } from 'vue';
import { isDefined } from '@vueuse/shared';

export function useTemplateRef<T = unknown, V = unknown>(fn: (obj: T) => V) {
  const templateRef = ref<T | null>(null);
  const value = computed<V | null>(() =>
    isDefined(templateRef) ? fn(templateRef.value as T) : null
  );
  return { templateRef, value };
}

export type useTemplateRefReturn = ReturnType<typeof useTemplateRef>;
