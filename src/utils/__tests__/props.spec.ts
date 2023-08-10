import { describe, it, expect } from 'vitest';
import { defineComponent, getCurrentInstance, h } from 'vue';
import { mount } from '../../../.test';
import { hasEvent } from '../props';

describe('props', () => {
  describe('hasEvent', () => {
    it.each([
      [{}, '', false],
      [{ onEventFoo: () => {} }, 'eventFoo', true],
      [{ onEventBar: () => {} }, 'event-bar', true]
    ])(
      'should work with props: %o, eventName: %o, result: %o',
      (props, eventName, expected) => {
        expect.assertions(1);

        const Child = defineComponent({
          setup() {
            const instance = getCurrentInstance()!;
            expect(hasEvent(instance, eventName)).toBe(expected);
            return () => null;
          }
        });

        mount(
          defineComponent({
            setup() {
              return () => h(Child, props);
            }
          })
        );
      }
    );
  });
});
