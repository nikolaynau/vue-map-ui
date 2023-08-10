import { describe, it, expect } from 'vitest';
import { defineComponent, getCurrentInstance, h, nextTick, ref } from 'vue';
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
          const { refs, otherProps, events } = pickProps(instance, props, [
            'a',
            'b'
          ]);

          expect(refs.a.value).toBe(1);
          expect(refs.b.value).toBe('foo');
          expect(otherProps).toStrictEqual({ c: true });
          expect(events).toStrictEqual([]);

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

    it('should pick refs when not passed to component', () => {
      expect.assertions(4);

      const Child = defineComponent({
        props: {
          a: {
            type: Number,
            default: 1
          },
          b: {
            type: String,
            default: 'bar'
          }
        },
        setup(props) {
          const instance = getCurrentInstance()!;
          const { refs, otherProps, events } = pickProps(instance, props, [
            'a',
            'b'
          ]);

          expect(refs.a.value).toBe(2);
          expect(refs.b.value).toBe('bar');
          expect(otherProps).toStrictEqual({});
          expect(events).toStrictEqual([]);

          return () => null;
        }
      });

      mount(
        defineComponent({
          setup() {
            return () => h(Child, { a: 2 });
          }
        })
      );
    });

    it('should pick other props', () => {
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
          const { refs, otherProps, events } = pickProps(instance, props, [
            'a'
          ]);

          expect(refs.a.value).toBe(1);
          expect(otherProps).toStrictEqual({ b: 'foo', c: true });
          expect(events).toStrictEqual([]);

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
          const { refs, otherProps, events } = pickProps(
            instance,
            props,
            ['a'],
            ['exclude-event']
          );

          expect(refs.a.value).toBe(1);
          expect(otherProps).toStrictEqual({});
          expect(events).toStrictEqual(['foo', 'bar', 'fooBar']);

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

    it('should reactive refs and not reactive other props', async () => {
      const a = ref(0);
      const b = ref('foo');
      let result: any = undefined;

      const Child = defineComponent({
        props: {
          a: {
            type: Number,
            default: 0
          },
          b: {
            type: String,
            default: undefined
          }
        },
        setup(props) {
          const instance = getCurrentInstance()!;
          result = pickProps(instance, props, ['a']);

          return () => null;
        }
      });

      mount(
        defineComponent({
          setup() {
            return () => h(Child, { a: a.value, b: b.value });
          }
        })
      );

      expect(result.refs.a.value).toBe(0);
      expect(result.otherProps.b).toBe('foo');

      a.value = 1;
      b.value = 'bar';
      await nextTick();

      expect(result.refs.a.value).toBe(1);
      expect(result.otherProps.b).toBe('foo');
    });

    it('should reactive other props when enabled', async () => {
      const a = ref(0);
      const b = ref('foo');
      let result: any = undefined;

      const Child = defineComponent({
        props: {
          a: {
            type: Number,
            default: 0
          },
          b: {
            type: String,
            default: undefined
          }
        },
        setup(props) {
          const instance = getCurrentInstance()!;
          result = pickProps(instance, props, ['a'], [], true);

          return () => null;
        }
      });

      mount(
        defineComponent({
          setup() {
            return () => h(Child, { a: a.value, b: b.value });
          }
        })
      );

      expect(result.refs.a.value).toBe(0);
      expect(result.otherProps.b).toBe('foo');

      a.value = 1;
      b.value = 'bar';
      await nextTick();

      expect(result.refs.a.value).toBe(1);
      expect(result.otherProps.b).toBe('bar');
    });
  });
});
