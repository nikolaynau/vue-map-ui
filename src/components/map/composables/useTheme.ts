import { computed, type ComputedRef, type MaybeRefOrGetter } from 'vue';
import { toRef, usePreferredDark } from '@vueuse/core';

export interface UseThemeOptions {
  cssPrefix?: MaybeRefOrGetter<string>;
}

export type UseThemeReturn = ComputedRef<string>;

export function useTheme(
  name: MaybeRefOrGetter<string | 'auto' | null | undefined>,
  options: UseThemeOptions = {}
): UseThemeReturn {
  const { cssPrefix = 'v-map-theme--' } = options;

  const _name = toRef(name);
  const _cssPrefix = toRef(cssPrefix);
  const _isDark = usePreferredDark();

  return computed(() => {
    return `${_cssPrefix.value}${
      !_name.value || _name.value === 'auto'
        ? _isDark.value
          ? 'dark'
          : 'light'
        : _name.value
    }`;
  });
}
