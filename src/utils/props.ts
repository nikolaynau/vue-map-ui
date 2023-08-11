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
  reactiveOther: boolean = false,
  noRefs: boolean = false
): { refs: { [P in K]: Ref<T[P]> }; other: Omit<T, K>; events: string[] } {
  const refs: Record<string, Ref<unknown>> = {};
  const other: Record<string, unknown> = reactiveOther ? reactive({}) : {};
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
          other[propKey] = reactiveOther
            ? toRef(props, propKey as K)
            : toRaw(props[propKey as K]);
        }
      }
    }
  }

  return { refs: refs as any, other: other as any, events };
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
