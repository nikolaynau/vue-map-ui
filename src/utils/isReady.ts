import { computed, type ComputedRef } from 'vue-demi';
import { type MaybeComputedRef, resolveUnref } from '@vueuse/shared';

export function isReady(
  value: MaybeComputedRef<unknown>
): ComputedRef<boolean> {
  return computed(() => !!resolveUnref(value));
}
