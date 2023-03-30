import { useAttrs as _useAttrs, camelize } from 'vue';
import { isEmpty, lcFirst } from '../utils/strings';

export function useAttrs<T = Function, U = unknown>(
  camelizeKeys: boolean = true
) {
  const result: {
    events: Record<string, T>;
    attrs: Record<string, U>;
  } = { events: {}, attrs: {} };

  const attrs = _useAttrs();
  for (const key in attrs) {
    if (key.startsWith('on') && typeof attrs[key] === 'function') {
      const eventName = lcFirst(key.slice(2));
      if (!isEmpty(eventName)) {
        result.events[eventName] = attrs[key] as T;
        continue;
      }
    }
    result.attrs[camelizeKeys ? camelize(key) : key] = attrs[key] as U;
  }

  return result;
}

export type UseAttrsReturn = ReturnType<typeof useAttrs>;
