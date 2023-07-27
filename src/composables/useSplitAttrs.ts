import { camelize, toRaw, useAttrs } from 'vue';
import { isEmpty, lcFirst } from '../utils/strings';

export interface UseSplitAttrsOptions {
  camelizeKeys?: boolean;
  rawValue?: boolean;
}

export type UseSplitAttrsReturn<T = Record<string, unknown>> = {
  default: T;
} & Record<string, T>;

export function useSplitAttrs(
  prefixes: string[],
  options: UseSplitAttrsOptions = {}
): UseSplitAttrsReturn {
  const { camelizeKeys, rawValue } = options;
  const result: UseSplitAttrsReturn = { default: {} };
  const attrs = useAttrs();
  let handled;

  for (const key in attrs) {
    handled = false;
    for (let i = 0; i < prefixes.length; i++) {
      const prefix = prefixes[i];
      if (!result[prefix]) {
        result[prefix] = {};
      }
      if (key.startsWith(prefix)) {
        const attrName = lcFirst(key.slice(prefix.length));
        if (!isEmpty(attrName)) {
          result[prefix][camelizeKeys ? camelize(attrName) : attrName] =
            rawValue ? toRaw(attrs[key]) : attrs[key];
          handled = true;
        }
      }
    }
    if (!handled) {
      result.default[camelizeKeys ? camelize(key) : key] = rawValue
        ? toRaw(attrs[key])
        : attrs[key];
    }
  }

  return result;
}
