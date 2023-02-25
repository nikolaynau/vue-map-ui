import { describe, it, expect } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@/../.test';
import { useAttrs, type UseAttrsReturn } from '../useAttrs';

describe('useAttrs', () => {
  const fn = () => {};

  it.each([
    [{}, {}, {}],
    [{ a: 1, b: 2 }, { a: 1, b: 2 }, {}],
    [
      { a: 1, b: 2, onC: fn, onD: fn },
      { a: 1, b: 2 },
      { c: fn, d: fn }
    ],
    [{ a: 1, on: fn }, { a: 1, on: fn }, {}]
  ])(
    'should work with source: %o, events: %o, attrs: %o',
    (sourceAttrs, expectedAttrs, expectedEvents) => {
      let result: UseAttrsReturn | undefined = undefined;

      const Child = defineComponent({
        setup() {
          result = useAttrs();
          return () => {};
        }
      });

      const Root = defineComponent({
        render() {
          return h(Child, { ...sourceAttrs });
        }
      });

      mount(Root);

      expect(result!.attrs).toEqual(expectedAttrs);
      expect(result!.events).toEqual(expectedEvents);
    }
  );
});
