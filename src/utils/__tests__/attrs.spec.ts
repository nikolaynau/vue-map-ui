import { describe, it, expect } from 'vitest';
import { getEventsFromAttrs, getPropsFromAttrs, getAttrs } from '../attrs';

describe('attrs', () => {
  it.each([
    [{}, undefined, []],
    [{ id: 'some_id', class: 'some classes' }, undefined, []],
    [{ onClick: () => {}, id: 'some_id' }, undefined, ['click']],
    [
      { onSomeEvent: () => {}, onSomeevent: () => {} },
      undefined,
      ['someEvent', 'someevent']
    ],
    [
      { onSomeEvent: () => {}, onSomeevent: () => {} },
      ['someEvent'],
      ['someevent']
    ],
    [{ on: () => {} }, undefined, []],
    [{ onclick: () => {} }, undefined, ['click']]
  ])(
    'getEventsFromAttrs: attrs(%o), exclude(%o), expected(%o)',
    (attrs, exclude, expected) => {
      const result = getEventsFromAttrs(attrs, exclude);
      expect(result).toEqual(expected);
    }
  );

  it.each([
    [{}, undefined, {}],
    [
      { id: 'some_id', class: 'some classes' },
      undefined,
      { id: 'some_id', class: 'some classes' }
    ],
    [
      { id: 'some_id', class: 'some classes' },
      ['id'],
      { class: 'some classes' }
    ],
    [{ onClick: () => {}, id: 'some_id' }, undefined, { id: 'some_id' }],
    [{ on: () => {} }, undefined, {}]
  ])(
    'getPropsFromAttrs: attrs(%o), exclude(%o), expected(%o)',
    (attrs, exclude, expected) => {
      const result = getPropsFromAttrs(attrs, exclude);
      expect(result).toEqual(expected);
    }
  );

  it.each([
    [{}, undefined, undefined, {}],
    [{ a: 1, b: 2 }, [], undefined, {}],
    [{ a: 1, b: 2 }, undefined, [], { a: 1, b: 2 }],
    [{ a: 1, b: 2 }, ['a'], undefined, { a: 1 }],
    [{ a: 1, b: 2 }, undefined, ['a'], { b: 2 }],
    [{ a: 1, b: 2 }, ['a'], ['a'], {}],
    [{ a: 1, b: 2 }, ['a', 'b'], ['a'], { b: 2 }],
    [{ a: 1, b: 2 }, undefined, ['a', 'b'], {}]
  ])(
    'getAttrs: attrs(%o), include(%o), exclude(%o), expected(%o)',
    (attrs, include, exclude, expected) => {
      const result = getAttrs(attrs, {
        include: include as any,
        exclude: exclude as any
      });
      expect(result).toEqual(expected);
    }
  );
});
