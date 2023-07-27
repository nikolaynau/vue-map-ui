import { computed, normalizeClass, type ComputedRef } from 'vue';
import { toValue, type MaybeRefOrGetter } from '@vueuse/shared';

export type UseMergeCssReturn = ComputedRef<string | undefined>;

export function useMergeCss(
  classA: MaybeRefOrGetter<any>,
  classB: MaybeRefOrGetter<any>
): UseMergeCssReturn {
  return computed<string | undefined>(() => {
    const valA = toValue(classA);
    const valB = toValue(classB);
    if (valA == null && valB == null) {
      return undefined;
    }
    return `${normalizeClass(valA)} ${normalizeClass(valB)}`.trim();
  });
}
