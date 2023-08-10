import {
  camelize,
  toRef,
  toRaw,
  reactive,
  type ComponentInternalInstance,
  type Ref
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
  omitEvents: string[] = [],
  reactiveOtherProps: boolean = false
): { refs: { [P in K]: Ref<T[P]> }; otherProps: Omit<T, K>; events: string[] } {
  const refs: Record<string, Ref<unknown>> = {};
  const otherProps: Record<string, unknown> = reactiveOtherProps
    ? reactive({})
    : {};
  const events: string[] = [];
  const keySet = new Set(keys);
  const omitEventSet = new Set(omitEvents.map(camelize));

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    refs[key as string] = toRef(props, key);
  }

  const vNodeProps = instance.vnode.props;
  if (vNodeProps) {
    for (const key in vNodeProps) {
      if (key.startsWith('on')) {
        const eventName = lcFirst(key.slice(2));
        if (!isEmpty(eventName) && !omitEventSet.has(eventName)) {
          events.push(eventName);
        }
      } else {
        const propKey = lcFirst(camelize(key));
        if (!keySet.has(propKey as K) && propKey in props) {
          otherProps[propKey] = reactiveOtherProps
            ? toRef(props, propKey as K)
            : toRaw(props[propKey as K]);
        }
      }
    }
  }

  return { refs: refs as any, otherProps: otherProps as any, events };
}
