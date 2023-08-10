import { describe, it, expect } from 'vitest';
import { defineComponent, getCurrentInstance, h } from 'vue';
import { mount } from '../../../.test';
import { hasEvent, pickProps } from '../props';

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

  describe('pickProps', () => {
    it('should pick refs', () => {
      expect.assertions(4);

      const Child = defineComponent({
        props: {
          a: {
            type: Number,
            default: 0
          },
          b: {
            type: String,
            default: undefined
          },
          c: {
            type: Boolean,
            default: false
          }
        },
        setup(props) {
          const instance = getCurrentInstance()!;
          const { refs, values, events } = pickProps(instance, props, [
            'a',
            'b'
          ]);

          expect(refs.a.value).toBe(1);
          expect(refs.b.value).toBe('foo');
          expect(values).toEqual({ c: true });
          expect(events).toEqual([]);

          return () => null;
        }
      });

      mount(
        defineComponent({
          setup() {
            return () => h(Child, { a: 1, b: 'foo', c: true, d: 'bar' });
          }
        })
      );
    });

    it('should pick values', () => {
      expect.assertions(3);

      const Child = defineComponent({
        props: {
          a: {
            type: Number,
            default: 0
          },
          b: {
            type: String,
            default: undefined
          },
          c: {
            type: Boolean,
            default: false
          }
        },
        setup(props) {
          const instance = getCurrentInstance()!;
          const { refs, values, events } = pickProps(instance, props, ['a']);

          expect(refs.a.value).toBe(1);
          expect(values).toEqual({ b: 'foo', c: true });
          expect(events).toEqual([]);

          return () => null;
        }
      });

      mount(
        defineComponent({
          setup() {
            return () => h(Child, { a: 1, b: 'foo', c: true, d: 'bar' });
          }
        })
      );
    });

    it('should return events', () => {
      expect.assertions(3);

      const Child = defineComponent({
        props: {
          a: {
            type: Number,
            default: 0
          }
        },
        setup(props) {
          const instance = getCurrentInstance()!;
          const { refs, values, events } = pickProps(
            instance,
            props,
            ['a'],
            ['exclude-event']
          );

          expect(refs.a.value).toBe(1);
          expect(values).toEqual({});
          expect(events).toEqual(['foo', 'bar', 'fooBar']);

          return () => null;
        }
      });

      mount(
        defineComponent({
          setup() {
            return () =>
              h(Child, {
                a: 1,
                b: 'foo',
                onFoo: () => {},
                onBar: () => {},
                onFooBar: () => {},
                onExcludeEvent: () => {}
              });
          }
        })
      );
    });
  });
});
