import {
  camelize,
  toRef,
  toRaw,
  reactive,
  type ComponentInternalInstance,
  type Ref
} from 'vue';
import { isEmpty, lcFirst, ucFirst } from './strings';

const EVENT_PREFIX = 'on';
const AFTER_EVENT_PREFIX_INDEX = EVENT_PREFIX.length + 1;

export function hasEvent(
  instance: ComponentInternalInstance,
  eventName: string
): boolean {
  const key = `${EVENT_PREFIX}${ucFirst(camelize(eventName))}`;
  const { props } = instance.vnode;
  return !!(props && key in props);
}

export function pickProps<T extends object, K extends keyof T>(
  instance: ComponentInternalInstance,
  props: T,
  keys: readonly K[],
  omitEvents: string[] = [],
  restReactive: boolean = false,
  noRefs: boolean = false
): { refs: { [P in K]: Ref<T[P]> }; rest: Omit<T, K>; events: string[] } {
  const refs: Record<string, Ref<unknown>> = {};
  const rest: Record<string, unknown> = restReactive ? reactive({}) : {};
  const events: string[] = [];
  const keySet = new Set(keys);
  const omitEventSet = new Set(omitEvents.map(camelize));

  if (!noRefs) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      refs[key as string] = toRef(props, key);
    }
  }

  const vNodeProps = instance.vnode.props;
  if (vNodeProps) {
    for (const key in vNodeProps) {
      if (key.startsWith(EVENT_PREFIX) && key[AFTER_EVENT_PREFIX_INDEX]) {
        const eventName = lcFirst(key.slice(2));
        if (!isEmpty(eventName) && !omitEventSet.has(eventName)) {
          events.push(eventName);
        }
      } else {
        const propKey = lcFirst(camelize(key));
        if (!keySet.has(propKey as K) && propKey in props) {
          rest[propKey] = restReactive
            ? toRef(props, propKey as K)
            : toRaw(props[propKey as K]);
        }
      }
    }
  }

  return { refs: refs as any, rest: rest as any, events };
}

export function pickAttrs<T = unknown>(
  attrs: Record<string, T>,
  options: {
    camelizeKeys?: boolean;
    rawValue?: boolean;
  } = {}
): Record<string, T> {
  const { camelizeKeys = true, rawValue = true } = options;
  const result: Record<string, T> = {};

  for (const key in attrs) {
    if (!(key.startsWith(EVENT_PREFIX) && key[AFTER_EVENT_PREFIX_INDEX])) {
      result[camelizeKeys ? camelize(key) : key] = (
        rawValue ? toRaw(attrs[key]) : attrs[key]
      ) as T;
    }
  }

  return result;
}

export function splitProps<T extends object, E extends keyof T = never>(
  instance: ComponentInternalInstance,
  props: T,
  prefix: string,
  exclude: E[] = [],
  isReactive: boolean = false,
  removePrefix: boolean = false,
  expludeRemovePrefix: E[] = []
): { matching: Record<string, any>; rest: Record<string, any> } {
  const result: { matching: Record<string, any>; rest: Record<string, any> } = {
    matching: isReactive ? reactive({}) : {},
    rest: isReactive ? reactive({}) : {}
  };
  const excludeSet = new Set(exclude);
  const expludeRemovePrefixSet = new Set(expludeRemovePrefix);
  const prefixLength = prefix.length;

  const vNodeProps = instance.vnode.props;
  if (vNodeProps) {
    for (const key in vNodeProps) {
      if (!(key.startsWith(EVENT_PREFIX) && key[AFTER_EVENT_PREFIX_INDEX])) {
        let propKey = lcFirst(camelize(key));
        if (!excludeSet.has(propKey as E) && propKey in props) {
          const value = isReactive
            ? toRef(props, propKey as E)
            : toRaw(props[propKey as E]);

          if (propKey.startsWith(prefix) && propKey[prefixLength]) {
            if (removePrefix && !expludeRemovePrefixSet.has(propKey as E)) {
              propKey = lcFirst(propKey.slice(prefixLength));
            }
            result.matching[propKey] = value;
          } else {
            result.rest[propKey] = value;
          }
        }
      }
    }
  }

  return result;
}
