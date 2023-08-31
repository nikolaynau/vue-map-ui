import {
  type MaybeRefOrGetter,
  type WatchStopHandle,
  watch,
  normalizeClass
} from 'vue';
import { toRef, type MaybeComputedElementRef } from '@vueuse/core';

export type UseCssClassReturn = () => void;

export function useCssClass(
  target: MaybeComputedElementRef<HTMLElement | null | undefined>,
  cssClass: MaybeRefOrGetter<unknown>
): UseCssClassReturn {
  const _target = toRef(target);
  const _cssClass = toRef(cssClass);
  const _stop: Array<WatchStopHandle> = [];

  _stop.push(
    watch(_cssClass, (newVal, oldVal) => {
      if (_target.value) {
        update(_target.value, newVal, oldVal);
      }
    })
  );

  _stop.push(
    watch(
      _target,
      () => {
        if (_target.value) {
          update(_target.value, _cssClass.value);
        }
      },
      { immediate: true }
    )
  );

  function update(el: HTMLElement, newVal?: unknown, oldVal?: unknown) {
    remove(el, oldVal);
    add(el, newVal);
  }

  function remove(el: HTMLElement, _class?: unknown) {
    const normalizedClass = normalize(_class);
    el.classList.remove(...normalizedClass);
  }

  function add(el: HTMLElement, _class?: unknown) {
    const normalizedClass = normalize(_class);
    el.classList.add(...normalizedClass);
  }

  function normalize(_class?: unknown): string[] {
    return normalizeClass(_class)
      .split(' ')
      .filter(c => !!c);
  }

  return () => {
    _stop.forEach(s => s());
    _stop.length = 0;
  };
}
