import { describe, it, expect } from 'vitest';
import { getEventsFromAttrs } from '../events';

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
});
