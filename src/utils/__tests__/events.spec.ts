import { describe, it, expect } from 'vitest';
import { getEventTypesFromAttrs } from '../events';

describe('events', () => {
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
    ]
  ])(
    'getEventTypesFromAttrs: attrs(%o), exclude(%o), expected(%o)',
    (attrs, exclude, expected) => {
      const result = getEventTypesFromAttrs(attrs, exclude);
      expect(result).toEqual(expected);
    }
  );
});
