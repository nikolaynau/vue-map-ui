import { camelize, toRaw, useAttrs } from 'vue';
import { isEmpty, lcFirst } from '../utils/strings';
import { defineGetter } from '../utils/objects';

export interface UseSplitAttrsOptions {
  camelizeKeys?: boolean;
  rawValue?: boolean;
}

export type UseSplitAttrsReturn<T = Record<string, unknown>> = {
  default: T;
} & Record<string, T>;

type KeyTuple = [string, string];

export function useSplitAttrs(
  prefixes: string[] = [],
  options: UseSplitAttrsOptions = {}
): UseSplitAttrsReturn {
  const { camelizeKeys, rawValue } = options;
  const keys: { default: KeyTuple[] } & Record<string, KeyTuple[]> = {
    default: []
  };

  const attrs = useAttrs();
  let handled;
  for (const key in attrs) {
    handled = false;
    for (let i = 0; i < prefixes.length; i++) {
      const prefix = prefixes[i];
      if (!keys[prefix]) {
        keys[prefix] = [];
      }
      if (key.startsWith(prefix)) {
        const hyphenated = key[prefix.length] === '-';
        const startIndex = hyphenated ? prefix.length + 1 : prefix.length;
        const attrName = hyphenated
          ? key.slice(startIndex)
          : lcFirst(key.slice(startIndex));
        if (!isEmpty(attrName)) {
          keys[prefix].push([
            key,
            camelizeKeys ? camelize(attrName) : attrName
          ]);
          handled = true;
        }
      }
    }
    if (!handled) {
      keys.default.push([key, camelizeKeys ? camelize(key) : key]);
    }
  }

  function createObject(keys: KeyTuple[]): Record<string, unknown> {
    return keys.reduce(
      (res, key) => {
        res[key[1]] = rawValue ? toRaw(attrs[key[0]]) : attrs[key[0]];
        return res;
      },
      {} as Record<string, unknown>
    );
  }

  const result: Record<string, unknown> = {};
  defineGetter(result, 'default', () => createObject(keys.default));

  for (let j = 0; j < prefixes.length; j++) {
    const prefix = prefixes[j];
    defineGetter(result, prefix, () => createObject(keys[prefix]));
  }

  return result as UseSplitAttrsReturn;
}
