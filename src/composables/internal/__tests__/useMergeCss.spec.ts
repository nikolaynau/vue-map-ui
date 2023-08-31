import { describe, it, expect } from 'vitest';
import { useMergeCss } from '../useMergeCss';

describe('useMergeCss', () => {
  it.each([
    [undefined, undefined, undefined],
    [null, null, undefined],
    [null, undefined, undefined],
    ['', undefined, ''],
    [undefined, '', ''],
    ['', '', ''],
    ['a', 'b', 'a b'],
    ['a b', '', 'a b'],
    ['', 'a b', 'a b'],
    ['a b', 'c', 'a b c'],
    [['a', 'b'], { c: true, d: false }, 'a b c'],
    [{ c: true, d: false }, ['a', 'b'], 'c a b']
  ])(
    'should work with classA: %o, classB: %o, result: %o',
    (classA, classB, result) => {
      expect(useMergeCss(classA, classB).value).toBe(result);
    }
  );
});
