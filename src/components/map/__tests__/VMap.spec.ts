import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VMap from '../VMap.vue';

describe('VMap', () => {
  it('render default props', () => {
    const wrapper = mount(VMap);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
