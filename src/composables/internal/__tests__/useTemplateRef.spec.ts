import { describe, it, expect } from 'vitest';
import { defineComponent, h, ref, unref } from 'vue';
import { mount } from '@vue/test-utils';
import { useTemplateRef } from '../useTemplateRef';

describe('useTemplateRef', () => {
  const Child = defineComponent({
    setup() {
      const x = ref(1);
      return { x };
    },
    render() {
      return h('div');
    }
  });

  const Root = defineComponent({
    setup() {
      const { templateRef, value } = useTemplateRef<
        InstanceType<typeof Child>,
        number
      >(obj => obj.x);
      return {
        templateRef,
        value
      };
    },
    render() {
      return h(Child, { ref: 'templateRef' });
    }
  });

  const A = class {
    public x = 0;
    public y = 1;
  };

  it('should work', () => {
    const { templateRef, value } = useTemplateRef<InstanceType<typeof A>>(
      obj => obj.y
    );

    expect(unref(templateRef)).toBeNull();
    expect(unref(value)).toBeNull();

    templateRef.value = new A();

    expect(unref(value)).toBe(1);
  });

  it('should work inside component', () => {
    const wrapper = mount(Root);
    expect(wrapper.vm.value).toBe(1);
  });
});
