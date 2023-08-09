import {
  camelize,
  toRef,
  type ComponentInternalInstance,
  type Ref,
  toRaw
} from 'vue';
import { isEmpty, lcFirst, ucFirst } from './strings';

export function hasEvent(
  instance: ComponentInternalInstance,
  eventName: string
): boolean {
  const key = `on${ucFirst(camelize(eventName))}`;
  const { props } = instance.vnode;
  return !!(props && key in props);
}

export function pickProps<T extends object, K extends keyof T>(
  instance: ComponentInternalInstance,
  props: T,
  keys: readonly K[],
  omitEvents: string[] = []
): { refs: { [P in K]: Ref<T[P]> }; values: Omit<T, K>; events: string[] } {
  const refs: Record<string, Ref<unknown>> = {};
  const values: Record<string, unknown> = {};
  const events: string[] = [];
  const _keys = new Set(keys);
  const _omitEvents = new Set(omitEvents.map(camelize));

  const vNodeProps = instance.vnode.props;
  if (vNodeProps) {
    for (const key in vNodeProps) {
      if (key.startsWith('on')) {
        const eventName = lcFirst(key.slice(2));
        if (!isEmpty(eventName) && !_omitEvents.has(eventName)) {
          events.push(eventName);
        }
      } else {
        const propKey = lcFirst(camelize(key));
        if (propKey in props) {
          if (_keys.has(propKey as K)) {
            refs[propKey] = toRef(props, propKey as K);
          } else {
            values[propKey] = toRaw(props[propKey as K]);
          }
        }
      }
    }
  }

  return { refs: refs as any, values: values as any, events };
}
