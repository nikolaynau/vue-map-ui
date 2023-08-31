import { describe, it, expect } from 'vitest';
import { defineComponent, getCurrentInstance, h, nextTick, ref } from 'vue';
import { mount } from '../../../.test';
import { hasEvent, pickAttrs, pickProps, splitProps } from '../props';

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
          const { refs, rest, events } = pickProps(instance, props, ['a', 'b']);

          expect(refs.a.value).toBe(1);
          expect(refs.b.value).toBe('foo');
          expect(rest).toStrictEqual({ c: true });
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
          const { refs, rest, events } = pickProps(instance, props, ['a', 'b']);

          expect(refs.a.value).toBe(2);
          expect(refs.b.value).toBe('bar');
          expect(rest).toStrictEqual({});
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
          const { refs, rest, events } = pickProps(instance, props, ['a']);

          expect(refs.a.value).toBe(1);
          expect(rest).toStrictEqual({ b: 'foo', c: true });
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
          const { refs, rest, events } = pickProps(
            instance,
            props,
            ['a'],
            ['exclude-event']
          );

          expect(refs.a.value).toBe(1);
          expect(rest).toStrictEqual({});
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
      let result: ReturnType<typeof pickProps> | undefined = undefined;

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

      expect((result!.refs as any).a.value).toBe(0);
      expect((result!.rest as any).b).toBe('foo');

      a.value = 1;
      b.value = 'bar';
      await nextTick();

      expect((result!.refs as any).a.value).toBe(1);
      expect((result!.rest as any).b).toBe('foo');
    });

    it('should reactive other props', async () => {
      const a = ref(0);
      const b = ref('foo');
      let result: ReturnType<typeof pickProps> | undefined = undefined;

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

      expect((result!.refs as any).a.value).toBe(0);
      expect((result!.rest as any).b).toBe('foo');

      a.value = 1;
      b.value = 'bar';
      await nextTick();

      expect((result!.refs as any).a.value).toBe(1);
      expect((result!.rest as any).b).toBe('bar');
    });

    it('should return no refs', () => {
      expect.assertions(2);

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
          const { refs, rest } = pickProps(
            instance,
            props,
            ['a'],
            [],
            false,
            true
          );

          expect(Object.keys(refs)).toHaveLength(0);
          expect(rest).toStrictEqual({ b: 'foo' });

          return () => null;
        }
      });

      mount(
        defineComponent({
          setup() {
            return () => h(Child, { a: 1, b: 'foo' });
          }
        })
      );
    });
  });

  describe('pickAttrs', () => {
    it.each([
      [{}, {}],
      [
        { foo: 1, bar: 2, 'foo-bar': 3, barFoo: 4, on: 5, onFoo: 6, onBar: 7 },
        { foo: 1, bar: 2, fooBar: 3, barFoo: 4, on: 5 }
      ]
    ])(
      'should work with source: %o, result: %o',
      (sourceAttrs, expectedAttrs) => {
        const result = pickAttrs(sourceAttrs);
        expect(result).toStrictEqual(expectedAttrs);
      }
    );
  });

  describe('splitProps', () => {
    it('should split props', () => {
      expect.assertions(2);

      const Child = defineComponent({
        props: {
          foo: {
            type: Number,
            default: 0
          },
          bar: {
            type: String,
            default: undefined
          },
          baz: {
            type: Boolean,
            default: false
          },
          ba: {
            type: String,
            default: undefined
          }
        },
        setup(props) {
          const instance = getCurrentInstance()!;
          const { matching, rest } = splitProps(instance, props, 'ba');

          expect(matching).toStrictEqual({ bar: 'foo', baz: true });
          expect(rest).toStrictEqual({ foo: 1, ba: 'ba' });

          return () => null;
        }
      });

      mount(
        defineComponent({
          setup() {
            return () =>
              h(Child, { foo: 1, bar: 'foo', baz: true, ba: 'ba', qux: 'bar' });
          }
        })
      );
    });

    it('should exclude props', () => {
      expect.assertions(2);

      const Child = defineComponent({
        props: {
          foo: {
            type: Number,
            default: 0
          },
          bar: {
            type: String,
            default: undefined
          },
          baz: {
            type: Boolean,
            default: false
          }
        },
        setup(props) {
          const instance = getCurrentInstance()!;
          const { matching, rest } = splitProps(instance, props, 'ba', ['baz']);

          expect(matching).toStrictEqual({ bar: 'foo' });
          expect(rest).toStrictEqual({ foo: 1 });

          return () => null;
        }
      });

      mount(
        defineComponent({
          setup() {
            return () =>
              h(Child, { foo: 1, bar: 'foo', baz: true, qux: 'bar' });
          }
        })
      );
    });

    it('should reactive rest props', async () => {
      const foo = ref('foo');
      const bar = ref('bar');
      let result: ReturnType<typeof splitProps> | undefined = undefined;

      const Child = defineComponent({
        props: {
          foo: {
            type: String,
            default: undefined
          },
          bar: {
            type: String,
            default: undefined
          }
        },
        setup(props) {
          const instance = getCurrentInstance()!;
          result = splitProps(instance, props, 'fo', [], true);

          return () => null;
        }
      });

      mount(
        defineComponent({
          setup() {
            return () => h(Child, { foo: foo.value, bar: bar.value });
          }
        })
      );

      expect(result!.matching.foo).toBe('foo');
      expect(result!.rest.bar).toBe('bar');

      foo.value = 'baz';
      bar.value = 'qux';
      await nextTick();

      expect(result!.matching.foo).toBe('baz');
      expect(result!.rest.bar).toBe('qux');
    });

    it('should remove prefix', () => {
      expect.assertions(2);

      const Child = defineComponent({
        props: {
          foo: {
            type: Number,
            default: 0
          },
          bar: {
            type: String,
            default: undefined
          },
          baz: {
            type: Boolean,
            default: false
          },
          ba: {
            type: String,
            default: undefined
          }
        },
        setup(props) {
          const instance = getCurrentInstance()!;
          const { matching, rest } = splitProps(
            instance,
            props,
            'ba',
            [],
            false,
            true,
            ['baz']
          );

          expect(matching).toStrictEqual({ r: 'foo', baz: true });
          expect(rest).toStrictEqual({ foo: 1, ba: 'ba' });

          return () => null;
        }
      });

      mount(
        defineComponent({
          setup() {
            return () =>
              h(Child, { foo: 1, bar: 'foo', baz: true, ba: 'ba', qux: 'bar' });
          }
        })
      );
    });
  });
});
