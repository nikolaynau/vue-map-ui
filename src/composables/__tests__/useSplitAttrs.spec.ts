import { describe, it, expect } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '../../../.test';
import {
  useSplitAttrs,
  type UseSplitAttrsOptions,
  type UseSplitAttrsReturn
} from '../useSplitAttrs';

describe('useSplitAttrs', () => {
  const fn = () => {};

  it.each([
    [{}, { default: {} }, undefined, undefined],
    [{ foo: 1, bar: 2 }, { default: { foo: 1, bar: 2 } }, undefined, undefined],
    [
      { 'foo-bar': 1, BarFoo: 2 },
      { default: { 'foo-bar': 1, BarFoo: 2 } },
      undefined,
      undefined
    ],
    [
      { 'foo-bar': 1, BarFoo: 2, 'a-foo-bar': 3, 'b-foo-bar': 4 },
      { default: { fooBar: 1, BarFoo: 2 }, a: { fooBar: 3 }, b: { fooBar: 4 } },
      ['a', 'b'],
      { camelizeKeys: true } as UseSplitAttrsOptions
    ],
    [
      { foo: 1, onEvent: fn },
      { default: { foo: 1, onEvent: fn } },
      undefined,
      undefined
    ],
    [
      { a: 1, b: 2, fooA: 3, fooB: 4, barA: 5, barB: 6, onEvent: fn },
      {
        default: { a: 1, b: 2, onEvent: fn },
        foo: { a: 3, b: 4 },
        bar: { a: 5, b: 6 }
      },
      ['foo', 'bar'],
      undefined
    ],
    [
      { '': null, a: 1, b: 2, foo: 3, bar: 4, onEvent: fn },
      {
        default: { a: 1, b: 2, foo: 3, bar: 4, onEvent: fn },
        foo: {},
        bar: {}
      },
      ['foo', 'bar'],
      undefined
    ],
    [
      { a: 1, fooA: 2, 'foo-b': 3, 'foo-C': 4 },
      {
        default: { a: 1 },
        foo: { a: 2, b: 3, C: 4 }
      },
      ['foo'],
      undefined
    ]
  ])(
    'should work with source: %o, expectedAttrs: %o, prefixes: %o, options: %o',
    (sourceAttrs, expectedAttrs, prefixes, options) => {
      let result: UseSplitAttrsReturn | undefined = undefined;

      const Child = defineComponent({
        setup() {
          result = useSplitAttrs(prefixes, options);
          return () => {};
        }
      });

      const Root = defineComponent({
        render() {
          return h(Child, { ...sourceAttrs });
        }
      });

      mount(Root);

      expect(result).toEqual(expectedAttrs);
    }
  );
});
