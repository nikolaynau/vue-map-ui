import { describe, it, expect } from 'vitest';
import { camelizeKeys } from '../objects';

describe('objects', () => {
  describe('camelizeKeys', () => {
    it.each([
      [{}, {}],
      [{ 'foo-bar': 1 }, { fooBar: 1 }],
      [{ 'foo-Bar': 1 }, { fooBar: 1 }],
      [{ 'Foo-Bar': 1 }, { FooBar: 1 }],
      [{ 'foo-bar-baz': 1 }, { fooBarBaz: 1 }],
      [{ foobar: 1 }, { foobar: 1 }],
      [{ Foobar: 1 }, { Foobar: 1 }],
      [{ fooBar: 1 }, { fooBar: 1 }]
    ])('should work with source: %o', (sourceAttrs, expectedAttrs) => {
      expect(camelizeKeys(sourceAttrs)).toEqual(expectedAttrs);
    });
  });
});
