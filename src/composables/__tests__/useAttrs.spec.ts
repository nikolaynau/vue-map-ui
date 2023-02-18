import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
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
    'useAttrs (source: %o, events: %o, attrs: %o)',
    (sourceAttrs, expectedAttrs, expectedEvents) => {
      let result: UseAttrsReturn | undefined = undefined;

      mount(
        {
          setup() {
            result = useAttrs();
            return () => {};
          }
        },
        { attrs: sourceAttrs }
      );

      expect(result!.attrs).toEqual(expectedAttrs);
      expect(result!.events).toEqual(expectedEvents);
    }
  );
});
