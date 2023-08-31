import { describe, it, expect, beforeEach } from 'vitest';
import { ref, markRaw, type Ref, nextTick } from 'vue';
import { useCssClass } from '../useCssClass';

describe('useCssClass', () => {
  let el: HTMLElement;
  let elRef: Ref<HTMLElement | null>;

  beforeEach(() => {
    el = document.createElement('div');
    elRef = ref(markRaw(el));
  });

  it('should init with empty', () => {
    expect(() => useCssClass(null, null)).not.toThrow();
    expect(() => useCssClass(undefined, undefined)).not.toThrow();
    expect(() => useCssClass(undefined, 'a')).not.toThrow();
  });

  it('should init', () => {
    useCssClass(el, 'a');
    expect(el.className).toBe('a');
  });

  it('should init with ref', () => {
    useCssClass(elRef, 'a');
    expect(elRef.value!.className).toBe('a');
  });

  it('should lazy init', async () => {
    elRef.value = null;
    useCssClass(elRef, 'a');

    elRef.value = markRaw(el);
    await nextTick();

    expect(elRef.value.className).toBe('a');
  });

  it('should update', async () => {
    const css = ref<string | null>(null);
    elRef.value?.classList.add('foo');
    useCssClass(elRef, css);
    expect(elRef.value!.className).toBe('foo');

    css.value = 'a';
    await nextTick();
    expect(elRef.value!.className).toBe('foo a');

    css.value = 'a b c';
    await nextTick();
    expect(elRef.value!.className).toBe('foo a b c');
  });

  it('should use array', async () => {
    const css = ref<string[]>(['a', 'b']);
    useCssClass(elRef, css);
    expect(elRef.value!.className).toBe('a b');
  });

  it('should use obj', async () => {
    const css = ref<Record<string, boolean>>({ a: true, b: false, c: true });
    useCssClass(elRef, css);
    expect(elRef.value!.className).toBe('a c');
  });

  it('should work stop watch', async () => {
    const css = ref<string>('a');
    const stop = useCssClass(elRef, css);
    expect(elRef.value!.className).toBe('a');

    css.value = 'b c';
    await nextTick();
    expect(elRef.value!.className).toBe('b c');

    stop();
    css.value = 'd';
    await nextTick();
    expect(elRef.value!.className).toBe('b c');
  });
});
